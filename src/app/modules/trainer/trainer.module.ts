import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { MatDialogModule } from '@angular/material/dialog';

import { DetailsComponent } from './templates/details/details.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { LoginComponent } from './templates/login/login.component';
import { SidebarLayoutComponent } from './templates/sidebar-layout/sidebar-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './templates/signup/signup.component';
import { SuccessComponent } from './templates/details/success/success.component';
import { ErrorDialogComponent } from './templates/details/error-dialog/error-dialog.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { NewBlogComponent } from './templates/blogs/new-blog/new-blog.component';
import { EffectsModule } from '@ngrx/effects';
import { trainerEffects } from './store/trainer.effects';
import { StoreModule } from '@ngrx/store';
import { blogsReducer } from './store/trainer.reducer';
import { ViewBlogComponent } from './templates/blogs/view-blog/view-blog.component';


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
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    StoreModule.forFeature('blogs', blogsReducer),
    EffectsModule.forFeature([trainerEffects])
  ] 
})
export class TrainerModule { }
