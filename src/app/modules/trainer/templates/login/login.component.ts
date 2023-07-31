import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { pattern } from '../../../../helpers/regex.pattern'
import { showError, swal } from 'src/app/helpers/swal.popup';
import { ErrorDialogComponent } from '../details/error-dialog/error-dialog.component';

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
  private subscription!: Subscription;

  constructor(private fb: FormBuilder, private trainerService: TrainerAuthService, private router: Router) {
    this.submit = false
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
    })
  }

  onSubmit() {
    this.submit = true
    this.loginTrainer()
  }

  loginTrainer() {
    this.subscription = this.trainerService.trainerLogin(this.loginForm.value).subscribe(
      (res) => {
      if (res.token) {
        localStorage.setItem('trainerToken', res.token)
        this.router.navigate(['trainer/dashboard']);
      } else {
        swal('error',res.message)
      }
    },(error)=>{
      showError(error)
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
  }
}
