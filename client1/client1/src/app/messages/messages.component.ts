import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit{
  messages: Message[]
  pagination : pagination
  pageNumber = 1;
  pageSize = 5
  container = 'Unread'
  constructor(private messageService:MessageService){

  }
  ngOnInit(){
    this.loadMessages()
  }
  deleteMessage(id:number){
    this.messageService.deleteMessage(id).subscribe(()=>{
      this.messages.splice(this.messages.findIndex(m => m.id == id),1)
  })
  }
loadMessages(){
  this.messageService.getmessages(this.pageNumber,this.pageSize,this.container).subscribe(
    res =>{
      this.messages = res.result
      this.pagination = res.pagination
    }
  )

}
pageChanged(event:any){
  this.pagination = event.page;
  this.loadMessages()
}
}
