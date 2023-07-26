import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtTrainerInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('trainerToken');
    if (
      !request.url.includes('/admin') &&
      token
    ) {
      const clonedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          panel: 'trainer',
        },
      });
      return next.handle(clonedReq);
    } else {
      return next.handle(request);
    }
  }
}
