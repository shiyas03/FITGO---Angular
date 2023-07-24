import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup
  submit: boolean = false
  incorrectPassword: boolean = false
  incorrectEmail: boolean = false
  private subscription!: Subscription;

  constructor(private fb: FormBuilder, private adminService: AdminAuthService, private router: Router) {
    this.submit = false
    this.incorrectPassword = false
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$")]],
    })
  }

  onSubmit() {
    this.submit = true;
    this.loginAdmin()
  }

  loginAdmin() {
    this.subscription = this.adminService.adminLogin(this.loginForm.value).subscribe((res) => {
      if (res.token) {
        localStorage.setItem('adminToken', res.token);
        this.router.navigate(['/admin'])
      } else {
        res.error == "email" ? this.incorrectEmail = true : this.incorrectPassword = true;
        setTimeout(() => {
          this.incorrectPassword = false;
          this.incorrectEmail = false;
        }, 2000)
      }
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
  }
}
