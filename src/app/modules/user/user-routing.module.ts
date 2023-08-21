import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './templates/home/home.component';
import { UserLoginGuard } from './guards/user-login.guard';
import { DetailsComponent } from './templates/details/details.component';
import { OtpComponent } from './templates/auth/otp/otp.component';
import { ProfileComponent } from './templates/profile/profile.component';
import { UserAuthGuard } from './guards/user-auth.guard';
import { EditUserComponent } from './templates/profile/edit-user/edit-user.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { SingleViewComponent } from './templates/blogs/single-view/single-view.component';
import { TrainerComponent } from './templates/trainers/trainer.component';
import { WorkoutsComponent } from './templates/workouts/workouts.component';
import { WorkoutViewComponent } from './templates/workouts/workout-view/workout-view.component';
import { TrainerViewComponent } from './templates/trainers/trainer-view/trainer-view.component';
import { PaymentsComponent } from './templates/payments/payments.component';
import { ChatComponent } from './templates/chat/chat.component';
import { AuthComponent } from './templates/auth/auth.component';

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
    path: 'auth',
    canActivate: [UserLoginGuard],
    children: [
      { path: '', component: AuthComponent },
      { path: 'verify', component: OtpComponent }
    ]
  },
  {
    path: 'details',
    component: DetailsComponent,
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
        path: '',
        component: BlogsComponent
      },
      {
        path: 'view',
        component: SingleViewComponent,
      },
    ],
  },
  {
    path: 'trainers',
    canActivate: [UserAuthGuard],
    children: [
      {
        path: '', component: TrainerComponent
      },
      {
        path: 'view', component: TrainerViewComponent
      }
    ]
  },
  {
    path: 'workouts',
    canActivate: [UserAuthGuard],
    children: [
      {
        path: '',
        component: WorkoutsComponent
      },
      {
        path: 'view',
        component: WorkoutViewComponent
      }
    ],
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [UserAuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
