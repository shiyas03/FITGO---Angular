import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrainerLoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem('trainerToken');
    if (isAuthenticated) {
      this.router.navigate(['/trainer/dashboard']);
      return false;
    } else {
      return true;
    }
  }

}