import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserLoginGuard implements CanActivate {

  constructor(private router: Router) {
    
  }

  canActivate(): boolean {
    const isAuthenticated = <string>localStorage.getItem('userToken');
    if (isAuthenticated) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
