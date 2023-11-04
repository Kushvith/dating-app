import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { getPaginatedResult, getPaginationHeaders } from './PaginationHelper';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection:HubConnection;
  private messageThreadSorce = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSorce.asObservable();
  constructor(private http:HttpClient) { }
  createHubConnection(user:User,otherUsername:string){
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl+'message?user='+otherUsername,{
      accessTokenFactory: ()=> user.token
    })
    .withAutomaticReconnect()
    .build();
    this.hubConnection.start().catch(error => console.log(error))
    this.hubConnection.on("ReciveMessageThread",messages =>{
      this.messageThreadSorce.next(messages)
    })
    this.hubConnection.on("NewMessage",message =>{
      this.messageThread$.pipe(take(1)).subscribe(messages =>{
        
        this.messageThreadSorce.next([...messages,message])
      })
    })
    this.hubConnection.on("UpdateGroup",(group:Group)=>{
      if(group.connections.some(x => x.username == otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe(messages =>{
          messages.forEach(message =>{
            if(!message.dateRead){
              message.dateRead = new Date(Date.now())
            }
          })
          this.messageThreadSorce.next([...messages])
        })
      }
    });
  }
  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop()
    }
  }
  getmessages(pageNumber,pageSize,container){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('Container',container);
    return  getPaginatedResult<Message[]>(this.baseUrl + 'message', params, this.http);
  }
  // getMessageThread(username:string){
  //   return this.http.get<Message[]>(this.baseUrl +'message/thread/'+username);
  // }
  async sendMessage(username:string,content:string){
    return this.hubConnection.invoke('SendMessage',{ReciepientUsername:username,content})
    .catch(error => console.log(error))
  }
  deleteMessage(id: number){
    return this.http.delete(this.baseUrl +'message/' + id);
  }
}
