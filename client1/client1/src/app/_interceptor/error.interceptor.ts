import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr:ToastrService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error =>{
        if(error){
          switch(error.status){
            case 400:
              if(error.error.errors){
                const modelStateErrors = [];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat();
              }
              else if(typeof(error.error) == 'object'){
                this.toastr.error(error.statusText,error.status)
              }
              else{
                this.toastr.error(error.error)
              }
              break;
            case 401:
              if(typeof(error.error) == 'object'){
                this.toastr.error(error.error.title,error.error.status)
              }else{
              this.toastr.error(error.statusText,error.status)
              }
              break;  
            case 404:
              this.router.navigateByUrl('/not-found');
              break;  
            case 500:
              const navigationExtras: NavigationExtras = {state:{error:error.error}}
              this.router.navigateByUrl('/server-error',navigationExtras);

              break;  
          }
        }
        return throwError(error);
      })
    );
  }
}
