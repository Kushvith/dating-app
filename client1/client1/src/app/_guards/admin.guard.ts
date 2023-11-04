import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


export const AdminGuard: CanActivateFn = (route, state):Observable<boolean> => {
  const accountService = inject(AccountService);
  var toastrservice = inject(ToastrService);
  return accountService.currentUser$.pipe(
    map(user =>{
      if(user.roles.includes('Admin') || user.roles.includes('Moderator')){
        return true;
      }
      toastrservice.error('You connot enter this area')
      return false;
    })
  )
};
