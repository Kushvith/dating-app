import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Observable, map } from 'rxjs';


export const authGuard: CanActivateFn = (route, state):Observable<boolean> => {
  const accountService = inject(AccountService);
  return accountService.currentUser$.pipe(
    map(user =>{
      if(user){
        return true;
      }
    })
  )
};
