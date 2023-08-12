import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { pattern } from 'src/app/common/regex.pattern';
import { showError, swal } from 'src/app/common/swal.popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup
  submit: boolean = false
  private subscription!: Subscription;

  constructor(
    private fb: FormBuilder, 
    private adminService: AdminAuthService,
    private router: Router
    ) {
    this.submit = false
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
    })
  }

  onSubmit() {
    this.submit = true;
    this.loginAdmin()
  }

  loginAdmin() {
    this.subscription = this.adminService.adminLogin(this.loginForm.value).subscribe(
      (res) => {
      if (res.token) {
        localStorage.setItem('adminToken', res.token);
        this.router.navigate(['/admin'])
      } else {
       swal('error',res.message);
      }
    },(error)=>{
      this.submit = false
      showError(error)
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
  }
}
