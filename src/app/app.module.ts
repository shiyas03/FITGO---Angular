import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtUserInterceptor } from './interceptors/jwt-user.interceptor';
import { JwtAdminInterceptor } from './interceptors/jwt-admin.interceptor';
import { JwtTrainerInterceptor } from './interceptors/jwt-trainer.interceptor';

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NotFoundPageComponent } from './modules/not-found-page/not-found-page.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';

const config: SocketIoConfig = { url: environment.apiURL, options: {} };

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    SocketIoModule.forRoot(config),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtUserInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtAdminInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtTrainerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
