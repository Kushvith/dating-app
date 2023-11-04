import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModelComponent } from '../modals/confirm-model/confirm-model.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef:BsModalRef;
  constructor(private modalService:BsModalService) { }
  Confirm(title='Confirmation',
  message='Are you sure leave this page',
  btnOkText='Ok',btnCancelText='Cancel'): Observable<boolean>{
    const config = {
      initialState:{
        title,
        message,
        btnOkText,
        btnCancelText
      }
    }
    this.bsModelRef = this.modalService.show(ConfirmModelComponent,config)
    return new Observable<boolean>(this.getResult())
  }
  private getResult(){
    return (observer) =>{
      const subscription = this.bsModelRef
      .onHidden.subscribe(()=>{
        observer.next(this.bsModelRef.content.result)
        observer.complete();
      })
      return {
        unsubscribe(){
          subscription.unsubscribe()
        }
      }
    }
  }
}
