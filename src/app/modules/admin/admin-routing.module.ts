import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { LoginComponent } from './templates/login/login.component';
import { AdminLoginGuard } from './guards/admin-login.guard';
import { UsersComponent } from './templates/users/users.component';
import { TrainersComponent } from './templates/trainers/trainers.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AdminLoginGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'trainers',
    component: TrainersComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    canActivate: [AdminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
