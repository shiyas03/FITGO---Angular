import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { userEffects } from './store/user.effects';
import { blogsReducer, profileReducer, trainerReducer, userReducer } from './store/user.reducer'
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NavBarComponent } from './templates/nav-bar/nav-bar.component';
import { LoginComponent } from './templates/login/login.component';
import { HomeComponent } from './templates/home/home.component';
import { RegisterComponent } from './templates/register/register.component';
import { BackgroundComponent } from './templates/background/background.component';
import { DetailsComponent } from './templates/details/details.component';
import { OtpComponent } from './templates/otp/otp.component';
import { ProfileComponent } from './templates/profile/profile.component';
import { FooterComponent } from './templates/footer/footer.component';
import { UserInfoComponent } from './templates/profile/user-info/user-info.component';
import { UserStatusComponent } from './templates/profile/user-status/user-status.component';
import { EditUserComponent } from './templates/profile/edit-user/edit-user.component';
import { BlogsComponent } from './templates/blogs/blogs.component';
import { SingleViewComponent } from './templates/blogs/single-view/single-view.component';
import { TrainerComponent } from './templates/trainers/trainer.component';
import { TrainerViewComponent } from './templates/trainers/trainer-view/trainer-view.component';


@NgModule({
  declarations: [
    NavBarComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    BackgroundComponent,
    DetailsComponent,
    OtpComponent,
    ProfileComponent,
    FooterComponent,
    UserInfoComponent,
    UserStatusComponent,
    EditUserComponent,
    BlogsComponent,
    SingleViewComponent,
    TrainerComponent,
    TrainerViewComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    StoreModule.forFeature('user', userReducer),
    StoreModule.forFeature('profile', profileReducer),
    StoreModule.forFeature('blogs', blogsReducer),
    StoreModule.forFeature('trainers', trainerReducer),
    EffectsModule.forFeature([userEffects])
  ]
})
export class UserModule { }
