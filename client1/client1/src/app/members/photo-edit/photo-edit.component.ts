import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Photo } from 'src/app/_models/Photo';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent {
  @Input() member: Member
  uploader: FileUploader
  hasDropzoneOver = false;
  base = environment.apiUrl;
  user : User
  constructor(private accountservice: AccountService,private memberService : MemberService) {
    this.accountservice.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.intializeUplaoder();
  }
  fileOverBase(e: any) {
    this.hasDropzoneOver = e;
  }
  setMain(photo:Photo) {
    console.log(1)
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountservice.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id == photo.id) p.isMain = true;
      })
    })
  }
  deleteMain(photoId) {

    this.memberService.getDelete(photoId).subscribe(() => {
     this.member.photos = this.member.photos.filter(x => x.id != photoId);
    })
  }
  intializeUplaoder() {
    this.uploader = new FileUploader({
      url: this.base + 'user/add-photo',
      authToken: "Bearer " + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }
    this.uploader.onSuccessItem = (item, response, status, headers)=>{
      if (response) {
        const photo:Photo= JSON.parse(response);
        this.member.photos.push(photo);
        if (photo.isMain) {
          this.member.photoUrl = photo.url
          this.user.photoUrl = photo.url
          this.accountservice.setCurrentUser(this.user)
        }
      }
    }
  }
  
}
