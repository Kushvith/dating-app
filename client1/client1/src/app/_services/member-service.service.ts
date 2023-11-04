import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  getDelete(photoId: any) {
    return this.http.delete(this.baseurl + 'user/delete-photo/'+photoId,{});
  }

  baseurl = environment.apiUrl;
  members:Member[] = [];
  memberCache = new Map();
  user:User
  userparams:UserParams
  constructor(private http:HttpClient,private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user)=>{
      this.user = user;
      this.userparams = new UserParams(user);
    })
   }
   addLike(username:string){
    return this.http.post(this.baseurl+'likes/'+username,{});
   }
   getlikes(predicate:string,pageNumber,pageSize){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate',predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseurl+"likes?predicate="+predicate,params,this.http);
   }
   setUserparams(params){
    this.userparams = params
   }
   getUserParams(){
    return this,this.userparams
   }
   resetFilters(){
    this.userparams = new UserParams(this.user)
    return this.userparams;
   }
  getMembers(userParams:UserParams){
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }
   let params = getPaginationHeaders(userParams.pageNumber,userParams.pageSize);
   params = params.append('minAge',userParams.minAge.toString());
   params = params.append('maxAge',userParams.maxAge.toString());
   params = params.append('gender',userParams.gender);
   params = params.append('orderBy',userParams.orderBy);
    return getPaginatedResult<Member[]>(this.baseurl + 'user',params,this.http).pipe(
      map(res =>{
        this.memberCache.set(Object.values(userParams).join('-'),res)
        return res;
      })
    );
      

  }
 
  getMember(username:string){
    // const member = this.members.find(x => x.username == username);
    // if(member !== undefined) return of(member);
    const member = [...this.memberCache.values()]
    .reduce((arr,elem)=> arr.concat(elem.result),[])
    .find((member:Member)=> member.username == username)
    if(member){
      return of(member);
    }
    return this.http.get<Member>(this.baseurl + 'user/'+username);
  }
  updateMember(member :Member){
    return this.http.put(this.baseurl + 'user/',member)
    .pipe(map(() =>{
      const index = this.members.indexOf(member);
      this.members[index] = member
    }));
  }
  setMainPhoto(photoId:number){
    return this.http.put(this.baseurl +'user/set-main/'+photoId,{});
  }
}
