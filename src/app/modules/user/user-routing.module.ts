import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './templates/home/home.component';
import { UserLoginGuard } from './guards/user-login.guard';
import { LoginComponent } from './templates/login/login.component';
import { RegisterComponent } from './templates/register/register.component';
import { DetailsComponent } from './templates/details/details.component';
import { OtpComponent } from './templates/otp/otp.component';
import { ProfileComponent } from './templates/profile/profile.component';
import { UserAuthGuard } from './guards/user-auth.guard';
import { EditUserComponent } from './templates/profile/edit-user/edit-user.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { SingleViewComponent } from './templates/blogs/single-view/single-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UserLoginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UserLoginGuard],
  },
  {
    path: 'details',
    component: DetailsComponent,
  },
  {
    path: 'otp',
    component: OtpComponent,
    canActivate: [UserLoginGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: 'edit-user',
    component: EditUserComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: 'blogs',
    canActivate: [UserAuthGuard],
    children: [
      {
        path:'',
        component:BlogsComponent
      },
      {
        path: 'single-view',
        component: SingleViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
