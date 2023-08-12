import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { Login } from '../../store/user';
import { Subscription } from 'rxjs';
import { LoginReturn } from '../../services/user.interface';
import { pattern } from '../../../../common/regex.pattern';
import { showError, swal } from '../../../../common/swal.popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  loginForm!: FormGroup;
  submit: boolean = false;
  private subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserAuthService,
    private router: Router,
  ) {
    this.submit = false;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(pattern.password)],
      ],
    });
  }

  onSubmit() {
    this.submit = true;
    if (this.loginForm.valid) {
      this.verifyUser(this.loginForm.value);
    }
  }

  verifyUser(formData: Login) {
    const details = formData;
    this.subscription = this.userService.verifyLogin(details).subscribe(
      (res: LoginReturn) => {
        if (res.message) {
          swal('error', res.message);
        }else{
          localStorage.setItem('userToken', res.token);
          const data = this.userService.getTokenData()
          localStorage.setItem('userId', data._id);
          this.router.navigate(['/']);
        }
      },(error)=>{
        showError(error)
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
