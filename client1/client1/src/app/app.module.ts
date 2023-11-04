import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './_modules/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { PhotoEditComponent } from './members/photo-edit/photo-edit.component';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ErrorInterceptor } from './_interceptor/error.interceptor';
import { JwtInterceptor } from './_interceptor/jwt.interceptor';
import { LoadingInterceptor } from './_interceptor/loading.interceptor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { AdminPannelComponent } from './admin/admin-pannel/admin-pannel.component';
import { HasAdminDirective } from './_directive/has-admin.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { RolesModelComponent } from './modals/roles-model/roles-model.component';
import { ConfirmModelComponent } from './modals/confirm-model/confirm-model.component';
@NgModule({
  declarations: [
    AppComponent,
    TestErrorComponent,
    HomeComponent,
    ListsComponent,
    MemberCardComponent,
    MemberDetailsComponent,
    MemberEditComponent,
    MemberlistComponent,
    PhotoEditComponent,
    MessagesComponent,
    NavComponent,
    NotFoundComponent,
    RegisterComponent,
    ServerErrorComponent,
    MemberMessagesComponent,
    AdminPannelComponent,
    HasAdminDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModelComponent,
    ConfirmModelComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true},
    {provide: HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    {provide: HTTP_INTERCEPTORS,useClass:LoadingInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
