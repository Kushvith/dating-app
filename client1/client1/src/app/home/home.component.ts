import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  registermode:boolean = false;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {

  }
  registerToggle(){
    this.registermode = !this.registermode;
  }
  cancelRegisterMode(event:boolean){
    this.registermode = event;
  }
}
