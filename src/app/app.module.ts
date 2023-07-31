import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtUserInterceptor } from './interceptors/jwt-user.interceptor';
import { JwtAdminInterceptor } from './interceptors/jwt-admin.interceptor';
import { JwtTrainerInterceptor } from './interceptors/jwt-trainer.interceptor';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtUserInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtAdminInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtTrainerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
