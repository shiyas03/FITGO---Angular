import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class 
AdminLoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem('adminToken');
    if (isAuthenticated) {
      this.router.navigate(['/admin']);
      return false;
    } else {
      return true;
    }
  }

}