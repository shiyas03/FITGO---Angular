import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor  {

    constructor(private _router:Router){}

    intercept(
        request: HttpRequest<string>,
        next: HttpHandler
      ): Observable<HttpEvent<string>> {
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this._router.navigate(['auth'])
            } else {
                console.log(error);
            }
            return throwError(error);
          })
        );
      }
}