import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtUserInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('userToken');
    if (
      request.url.includes('/user') &&
      !request.url.includes('/admin') &&
      !request.url.includes('/trainer') &&
      token
    ) {
      const clonedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          panel: 'user',
        },
      });
      return next.handle(clonedReq);
    } else {
      return next.handle(request);
    }
  }
}
