import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrainerAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem('trainerToken');
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/trainer/login']);
      return false;
    }
  }

}

