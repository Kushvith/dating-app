import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  model:any={};
  registerForm:FormGroup;

  maxDate:Date;
  bsConfig:Partial<BsDatepickerConfig>;
  validationError : String[] = [];
    constructor(private accountService:AccountService,private router:Router) { }
  
    ngOnInit(): void {
      this.initializeForm()
      this.maxDate = new Date()
      this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
      this.bsConfig = {
        containerClass : 'theme-red',
        dateInputFormat: 'DD MMMM YYYY'
      }
    }

    initializeForm(){
      this.registerForm = new FormGroup({
        username: new FormControl('',Validators.required),
        password:new FormControl('',[Validators.required,Validators.minLength(4),Validators
        .maxLength(8)]),
        confirmPassword:new FormControl('',[Validators.required,this.matchValues('password')]),
        gender:new FormControl('male',[Validators.required]),
        knownAs: new FormControl('',Validators.required),
        dateOfBirth: new FormControl('',Validators.required),
        city: new FormControl('',Validators.required),
        country:new FormControl('',Validators.required),
        

      })
    }
    matchValues(matchTo): ValidatorFn {
      return (control: AbstractControl) => {
        return control?.value == control?.parent?.controls[matchTo].value ? null
          : { isMatching : true}
      }
    }
  register(){
    console.log(this.registerForm.value)
       this.accountService.register(this.registerForm.value).subscribe(
        (res)=>{
          this.router.navigateByUrl('members/')
        },error =>{
          this.validationError = error
        }
      )
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
