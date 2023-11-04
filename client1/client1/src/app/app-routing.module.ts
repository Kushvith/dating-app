import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { authGuard } from './_guards/auth.guard';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDetailResolver } from './_resolver/member-detail.resolver';
import { AdminPannelComponent } from './admin/admin-pannel/admin-pannel.component';
import { AdminGuard } from './_guards/admin.guard';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[authGuard],
    children:[
      {path:'members',component:MemberlistComponent},
      {path:'member/edit',component:MemberEditComponent,canDeactivate:[preventUnsavedChangesGuard]},
      {path:'members/:username',component:MemberDetailsComponent,resolve:{member:memberDetailResolver}},
      {path:'lists',component:ListsComponent},
      {path:'messages',component:MessagesComponent},
      {path:'admin',component:AdminPannelComponent,canActivate:[AdminGuard]},

    ]
  },
  {path:'not-found',component:NotFoundComponent},
  {path:'server-error',component:ServerErrorComponent},
 {path:'errors',component:TestErrorComponent},
  {path:'**',component:HomeComponent,pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
