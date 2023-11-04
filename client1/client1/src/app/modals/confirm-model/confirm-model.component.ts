import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-model',
  templateUrl: './confirm-model.component.html',
  styleUrls: ['./confirm-model.component.css']
})
export class ConfirmModelComponent {
  title:string;
  message:string;
  btnOkText:string;
  btnCancelText:string;
  result:boolean;
  constructor(public bsModalRef:BsModalRef){}
  confirm(){
    this.result = true;
    this.bsModalRef.hide()
  }
  decline(){
    this.result = false;
    this.bsModalRef.hide()
  }
}
