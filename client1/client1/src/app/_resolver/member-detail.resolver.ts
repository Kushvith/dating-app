import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Member } from '../_models/member';
import { Inject, Injectable } from '@angular/core';
import { MemberService } from '../_services/member-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class memberDetailResolver implements Resolve<Member>{
  constructor(private memberservice:MemberService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Member | Observable<Member> | Promise<Member> {
      return this.memberservice.getMember(route.paramMap.get('username'));
  }
}
