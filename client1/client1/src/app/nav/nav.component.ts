import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  model:any={};
  validation = []

  constructor(public accountService:AccountService,private toastr:ToastrService) { }

  ngOnInit(): void {

  }
  login() {
    this.accountService.login(this.model).subscribe(response =>{
     console.log(response);

    },error=>{ 
      this.toastr.error(error)
      console.log(error[0])
      this.validation = error
    })
   }
   getCurrentUser(){
    this.accountService.currentUser$.subscribe(user =>{
      
    })
   }
   logout(){
    this.accountService.logout();
   }
}
