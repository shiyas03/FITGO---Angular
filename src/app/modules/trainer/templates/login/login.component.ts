import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  submit: boolean = false;
  incorrectPassword: boolean = false
  incorrectEmail: boolean = false
  passwordPattern: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
  private subscription!: Subscription;

  constructor(private fb: FormBuilder, private trainerService: TrainerAuthService, private router: Router) {
    this.submit = false
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    })
  }

  onSubmit() {
    this.submit = true
    this.loginTrainer()
  }

  loginTrainer() {
    this.subscription = this.trainerService.trainerLogin(this.loginForm.value).subscribe((response) => {
      if (response.token) {
        localStorage.setItem('trainerToken', response.token)
        this.router.navigate(['trainer/dashboard']);
      } else {
        response.error == 'password' ? this.incorrectPassword = true : this.incorrectEmail = true
        setTimeout(() => {
          this.incorrectPassword = false
          this.incorrectEmail = false
        }, 2000)
      }
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
  }
}
