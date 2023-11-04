import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';

@Directive({
  selector: '[appHasAdmin]'
})
export class HasAdminDirective implements OnInit {
  @Input() appHasAdmin:string[];
  user :User

  constructor(private viewContainerRef:ViewContainerRef,
    private templateRef:TemplateRef<any>,
    private accountservice:AccountService) {
      this.accountservice.currentUser$.pipe(take(1)).subscribe(
        user =>{
          this.user = user
        }
      )
     }
  ngOnInit(): void {
    if(!this.user?.roles||this.user == null){
      this.viewContainerRef.clear();
      return;
    }
    if(this.user?.roles.some(r => this.appHasAdmin.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainerRef.clear()
    }
  }

}
