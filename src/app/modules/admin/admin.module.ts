import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoginComponent } from './templates/login/login.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { SidebarLayoutComponent } from './templates/sidebar-layout/sidebar-layout.component';
import { UsersComponent } from './templates/users/users.component';
import { TrainersComponent } from './templates/trainers/trainers.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { ViewBlogComponent } from './templates/blogs/view-blog/view-blog.component';

import { blogsReducer, trainerReducer, usersReducer, workoutReducer } from './store/admin.reducer';
import { AdminEffect } from './store/admin.effects';
import { WorkoutsComponent } from './templates/workouts/workouts.component';
import { ShowWorkoutComponent } from './templates/workouts/show-workout/show-workout.component';


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
    ShowWorkoutComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forFeature('users', usersReducer),
    StoreModule.forFeature('trainers', trainerReducer),
    StoreModule.forFeature('blogs', blogsReducer),
    StoreModule.forFeature('workouts', workoutReducer),
    EffectsModule.forFeature([AdminEffect])
  ]

})
export class AdminModule { }
