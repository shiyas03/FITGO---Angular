import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { Register, RegisterReturn, Error } from '../../services/user.interface';
import { Subscription } from 'rxjs';
import { swal } from '../../../../helpers/swal.popup';
import { pattern } from '../../../../helpers/regex.pattern';
import { HttpErrorResponse } from '@angular/common/http';
import { swalError } from '../../../../helpers/swal.popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  submit: boolean = false;
  inCorrect: boolean = false;
  emailUsed: boolean = false;
  phoneUsed: boolean = false;
  registerForm!: FormGroup;
  nameError: boolean = false;
  phoneError: boolean = false;
  private subscription1!: Subscription;
  private subscription2!: Subscription;

  constructor(
    private fb: FormBuilder,
    public userService: UserAuthService,
    private router: Router,
  ) {
    this.submit = false;
    this.nameError = false;
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(pattern.phone),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(pattern.password)],
      ],
      cpassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('otp');
  }

  onSubmit() {
    this.submit = true;
    const { name, email, phone, password, cpassword } = this.registerForm.value;
    if (isNaN(phone)) {
      this.phoneError = true;
    }
    if (!name.trim()) {
      this.nameError = true;
    }
    if (cpassword === password && this.registerForm.valid) {
      this.registerUser();
    } else {
      this.inCorrect = true;
    }
    this.destroyError();
  }

  registerUser(): void {
    const registerData: Register = this.registerForm.value;
    this.subscription1 = this.userService.registerUser(registerData).subscribe(
      (res: RegisterReturn) => {
        if (res.success == false) {
          swal('error', <string>res.message);
        } else {
          if (res.id) {
            localStorage.setItem('userId', res.id);
            this.subscription2 = this.userService.sendMail(res.id).subscribe(
              (res) => {
                if (res.success) {
                  localStorage.setItem('otp', res.otp);
                  this.router.navigate(['/otp']);
                }
              },
              (error: HttpErrorResponse) => {
                this.error(error);
              },
            );
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.error(error);
      },
    );
  }

  destroyError() {
    setTimeout(() => {
      this.submit = false;
      this.nameError = false;
      this.phoneError = false;
      this.inCorrect = false;
    }, 3000);
  }

  error(error: Error) {
    if (error.error instanceof ErrorEvent) {
      swalError(error.error.message);
      console.error('Client-side error:', error.error.message);
    } else {
      swalError(error.statusText);
      console.error('Server-side error:', error.status, error.statusText);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }
}
