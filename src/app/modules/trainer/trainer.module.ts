import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { blogsReducer, profileReducer, workoutReducer } from './store/trainer.reducer';
import { trainerEffects } from './store/trainer.effects';
import { StoreModule } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { DetailsComponent } from './templates/details/details.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { LoginComponent } from './templates/login/login.component';
import { SidebarLayoutComponent } from './templates/sidebar-layout/sidebar-layout.component';
import { SignupComponent } from './templates/signup/signup.component';
import { SuccessComponent } from './templates/details/success/success.component';
import { ErrorDialogComponent } from './templates/details/error-dialog/error-dialog.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { NewBlogComponent } from './templates/blogs/new-blog/new-blog.component';
import { ViewBlogComponent } from './templates/blogs/view-blog/view-blog.component';
import { ProfileComponent } from './templates/profile/profile.component';
import { WorkoutsComponent } from './templates/workouts/workouts.component';
import { NewWorkoutComponent } from './templates/workouts/new-workout/new-workout.component';
import { ShowWorkoutComponent } from './templates/workouts/show-workout/show-workout.component';
import { EditBlogComponent } from './templates/blogs/edit-blog/edit-blog.component';
import { EditWorkoutComponent } from './templates/workouts/edit-workout/edit-workout.component';



@NgModule({
  declarations: [
    DetailsComponent,
    DashboardComponent,
    LoginComponent,
    SidebarLayoutComponent,
    SignupComponent,
    SuccessComponent,
    ErrorDialogComponent,
    BlogsComponent,
    NewBlogComponent,
    ViewBlogComponent,
    ProfileComponent,
    WorkoutsComponent,
    NewWorkoutComponent,
    ShowWorkoutComponent,
    EditBlogComponent,
    EditWorkoutComponent,
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    StoreModule.forFeature('blogs', blogsReducer),
    StoreModule.forFeature('profile', profileReducer),
    StoreModule.forFeature('workouts', workoutReducer),
    EffectsModule.forFeature([trainerEffects])
  ] 
})
export class TrainerModule { }
