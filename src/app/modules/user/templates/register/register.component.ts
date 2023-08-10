import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { Register, RegisterReturn, Error } from '../../services/user.interface';
import { Subscription } from 'rxjs';
import { showError, swal } from '../../../../helpers/swal.popup';
import { pattern } from '../../../../helpers/regex.pattern';
import { HttpErrorResponse } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { saveRegiterData } from '../../store/user.action';
import { registeSelectorData } from '../../store/user.selector';

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
  error: boolean = false
  private subscription1!: Subscription;

  constructor(
    private fb: FormBuilder,
    public userService: UserAuthService,
    private router: Router,
    private store: Store<Register>) { }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(pattern.phone)]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
      cpassword: ['', [Validators.required]],
    });
    this.store.pipe(select(registeSelectorData)).subscribe(data => {
      if (data) {
        this.registerForm.patchValue(data)
      }
    })
  }

  onSubmit() {
    this.error = false
    this.submit = true;
    this.formValid()
    if (!this.error && this.registerForm.valid) {
      this.store.dispatch(saveRegiterData({ register: this.registerForm.value }))
      this.registerUser();
    }
    this.destroyError();
  }

  registerUser(): void {
    const email = <string>this.registerForm.value.email;
    this.userService.registerUser(this.registerForm.value).subscribe(res => {
      if (res.success) {
        this.subscription1 = this.userService.sendMail(email).subscribe(
          (res) => {
            if (res.success) {
              localStorage.setItem('otp', res.otp);
              this.router.navigate(['/otp']);
            }
          },
          (error: HttpErrorResponse) => {
            showError(error)
          }
        )
      } else {
        swal('error',res.message)
      }
    })
  }

  formValid() {
    const { name, phone, password, cpassword } = this.registerForm.value;
    switch (this.submit) {
      case !name.trim():
        this.nameError = true;
        this.error = true
        break;
      case !phone.trim():
        this.phoneError = true;
        this.error = true
        break;
      case password !== cpassword:
        this.inCorrect = true;
        this.error = true
        break;
      default:
        break;
    }
  }

  destroyError() {
    setTimeout(() => {
      this.submit = false;
      this.nameError = false;
      this.phoneError = false;
      this.inCorrect = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe();
  }
}
