import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MemberService } from '../_services/member-service.service';
import { pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members:Partial<Member[]>;
  predicate= 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination:pagination
  constructor(private memberService:MemberService){

  }


  ngOnInit(){
    this.loadLikes()
  }
  loadLikes(){
    this.memberService.getlikes(this.predicate,this.pageNumber,this.pageSize).subscribe(
      (response)=>{
        this.members = response.result;
        this.pagination = response.pagination
      });
  }
  pageChanged(event:any){
    this.pageNumber = event.page
    this.loadLikes();
  }
}
