import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection:HubConnection
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUser$ = this.onlineUsersSource.asObservable();
  constructor(private toastrService:ToastrService,private router:Router) { }
  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl +'presence',{
      accessTokenFactory:()=>user.token
    })
    .withAutomaticReconnect()
    .build()
    this.hubConnection
    .start()
    .catch(error => console.log(error))
    this.hubConnection.on('UserIsOnline',username =>{
      this.onlineUser$.pipe(take(1)).subscribe(usernames =>{
        this.onlineUsersSource.next([...usernames,username])
      })
    })
    this.hubConnection.on("UserIsOffline",username =>{
     this.onlineUser$.pipe(take(1)).subscribe(usernames =>{
      this.onlineUsersSource.next([...usernames.filter(x => x!==username)])
     })
    })
    this.hubConnection.on('GetOnlineUsers',(username:string[])=>{
      this.onlineUsersSource.next(username)
    })
    this.hubConnection.on('NewMessageRecieved',({username,knownAs})=>{
      this.toastrService.info(knownAs +' has sent you a message!')
      .onTap.pipe(take(1))
      .subscribe(()=>{
        this.router.navigateByUrl('/members/'+username+'?tab=3')
      })
    })
  }
  stopHubConnection()
  {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
