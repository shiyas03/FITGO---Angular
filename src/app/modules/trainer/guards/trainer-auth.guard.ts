import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TrainerAuthService } from '../services/trainer-auth.service';
import { decodeToken } from 'src/app/helpers/token.decode';

@Injectable({
  providedIn: 'root'
})
export class TrainerAuthGuard implements CanActivate {

  constructor(private router: Router, private service: TrainerAuthService) {
    const token = <string>localStorage.getItem('trainerToken');
    if (token) {
      const { id, email, name } = decodeToken(token)
      localStorage.setItem("trainerId",id)
      this.service.trainerAccess(id).subscribe(res => {
        if (res.access === false) {
          localStorage.removeItem('trainerToken')
          router.navigate(['/trainer/login'])
        }
      })
    }
  }

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

