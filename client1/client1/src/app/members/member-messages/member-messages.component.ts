import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
 @Input() messages:Message[];
 @Input() username;
 @ViewChild('messageForm') messageForm: NgForm
 messageContent:string

  ngOnInit(): void {
 
  }
  constructor(public messageService:MessageService){}
sendMessages(){
  this.messageService.sendMessage(this.username,this.messageContent).then(
    ()=>{
      this.messageForm.reset();
    }
  )
}
}
