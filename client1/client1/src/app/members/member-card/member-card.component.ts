import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member-service.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
   
    @Input() member: Member;
    constructor(private memberService:MemberService,private toastrService:ToastrService,public presence:PresenceService) { }
  
    ngOnInit(): void {
    }
    addLike(member:Member){
      this.memberService.addLike(member.username).subscribe(
        ()=>{
          this.toastrService.success('you have liked '+member.knownAs)
        }
      )
    }
  
  }
  

