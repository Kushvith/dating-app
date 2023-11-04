import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment.development';
import { FormGroup } from '@angular/forms';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,private router:Router,private presenceService:PresenceService) { }
  login(model:User){
    return this.http.post(this.baseUrl + 'account/login',model).pipe(
       map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
          this.router.navigateByUrl('/members');
        }
      })

    );
  }
  register(model:FormGroup){
    console.log(1)
    return this.http.post(this.baseUrl + 'account/register',model).pipe(
      map((response:User)=>{
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user)
          this.router.navigateByUrl('/members');
        }
      })
    )
  }
  setCurrentUser(user:User){
    user.roles = []
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    console.log(user)
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection()
    this.router.navigateByUrl('/');
  }
  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
