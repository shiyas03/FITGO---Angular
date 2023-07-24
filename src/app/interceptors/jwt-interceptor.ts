import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<string>> { 
    let jwtToken: string[] = []
    jwtToken[0] = localStorage.getItem('userToken') || ''
    jwtToken[1] = localStorage.getItem('trainerToken') || ''
    jwtToken[2] = localStorage.getItem('adminToken') || ''
    
    if (jwtToken) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        }
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
} 