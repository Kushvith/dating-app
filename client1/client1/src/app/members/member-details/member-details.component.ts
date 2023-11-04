import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member-service.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit,OnDestroy {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages:Message[] = []
  activeTab : TabDirective;
  user:User;
  @ViewChild('memberTabs',{static:true}) memberTabs : TabsetComponent
  constructor(private memberService:MemberService,private route:ActivatedRoute,
    private messageService:MessageService,private accountService:AccountService,
    private router:Router,
    public presence:PresenceService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(
        user => this.user = user
      )
      this.router.routeReuseStrategy.shouldReuseRoute = ()=>false;
     }
 

  ngOnInit(): void {
    this.route.data.subscribe(data =>{
      this.member = data.member
    })
   
    this.galleryImages = this.getImages();
    this.route.queryParams.subscribe(params =>{
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
    this.galleryOptions = [{
      width: '500px',
      height: '400px',
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview:false
  }]

  }
  getImages(): NgxGalleryImage[] {
    const imgUrls = []
    for(const photo of this.member.photos){
      imgUrls.push(
        {
          small:photo?.url,
          medium:photo?.url,
          big:photo?.url
        }
      )
    }
    return imgUrls;
  }
loadMember(){
  this.memberService.getMember(this.route.snapshot.paramMap.get('username')
  ).subscribe(member =>{
    this.member = member;
   
  })
}

selectTab(tabId : number){
  this.memberTabs.tabs[tabId].active = true;
}
onTabActivated(data: TabDirective){
  this.activeTab = data
  if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.messageService.createHubConnection(this.user,this.member.username)
  }else{
    this.messageService.stopHubConnection()
  }
}
ngOnDestroy(){
  this.messageService.stopHubConnection()
}
}
