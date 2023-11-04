import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dating App';
  users:any;
  constructor(private http: HttpClient,private accountservice:AccountService,private presence:PresenceService){}
  ngOnInit(){
    this.setCurrentUser();
  }
  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    this.accountservice.setCurrentUser(user);
    this.presence.createHubConnection(user);
  }

}
