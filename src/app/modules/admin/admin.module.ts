import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';

import { blogsReducer, paymentReducer, trainerReducer, usersReducer, workoutReducer } from './store/admin.reducer';
import { AdminEffect } from './store/admin.effects';

import { LoginComponent } from './templates/login/login.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { SidebarLayoutComponent } from './templates/sidebar-layout/sidebar-layout.component';
import { UsersComponent } from './templates/users/users.component';
import { TrainersComponent } from './templates/trainers/trainers.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { ViewBlogComponent } from './templates/blogs/view-blog/view-blog.component';
import { WorkoutsComponent } from './templates/workouts/workouts.component';
import { ShowWorkoutComponent } from './templates/workouts/show-workout/show-workout.component';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaymentsComponent } from './templates/payments/payments.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportComponent } from './templates/report/report.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    SidebarLayoutComponent,
    UsersComponent,
    TrainersComponent,
    BlogsComponent,
    ViewBlogComponent,
    WorkoutsComponent,
    ShowWorkoutComponent,
    PaymentsComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    NgApexchartsModule,
    StoreModule.forFeature('users', usersReducer),
    StoreModule.forFeature('trainers', trainerReducer),
    StoreModule.forFeature('blogs', blogsReducer),
    StoreModule.forFeature('workouts', workoutReducer),
    StoreModule.forFeature('payments', paymentReducer),
    EffectsModule.forFeature([AdminEffect])
  ]

})
export class AdminModule { }
