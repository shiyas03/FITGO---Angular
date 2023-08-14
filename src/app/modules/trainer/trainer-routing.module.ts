import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './templates/details/details.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { LoginComponent } from './templates/login/login.component';
import { TrainerAuthGuard } from './guards/trainer-auth.guard';
import { TrainerLoginGuard } from './guards/trainer-login.guard';
import { SignupComponent } from './templates/signup/signup.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { ProfileComponent } from './templates/profile/profile.component';
import { WorkoutsComponent } from './templates/workouts/workouts.component';
import { PaymentsComponent } from './templates/payments/payments.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [TrainerAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [TrainerLoginGuard],
  },
  {
    path: 'register',
    component: SignupComponent,
    canActivate: [TrainerLoginGuard],
  },
  {
    path: 'details',
    component: DetailsComponent,
    canActivate: [TrainerLoginGuard],
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    canActivate: [TrainerAuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [TrainerAuthGuard],
  },
  {
    path: 'workouts', component: WorkoutsComponent, 
    canActivate: [TrainerAuthGuard]
  },
  {
    path: 'payments', component: PaymentsComponent, 
    canActivate: [TrainerAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerRoutingModule {}
