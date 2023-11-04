import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member-service.service';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent {
 members:Member[];
 pagination:pagination;
user:User;
userparams:UserParams;
genderList = [{value:'male',display:"Male"},{value:"female",display:"Female"}]

  constructor(private memberService:MemberService,private accountService:AccountService) {
    this.userparams = this.memberService.getUserParams();
   }

  ngOnInit(): void {
    this.loadMember()
  }
  resetFilters(){
    this.userparams = this.memberService.resetFilters()
    this.loadMember()
  }
  loadMember(){
    this.memberService.getMembers(this.userparams).subscribe(
      (res)=>{
        this.members = res.result
        this.pagination = res.pagination
      }
    )
  }
  pageChanged(event:any){
    this.userparams.pageNumber = event.page
    this.memberService.setUserparams(this.userparams)
    this.loadMember();
  }
}
