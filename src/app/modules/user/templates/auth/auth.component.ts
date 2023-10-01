import { Component, ElementRef, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthService } from '../../services/user-auth.service';
import { Login, Register } from '../../store/user';
import { LoginReturn } from '../../services/user.interface';
import { showError, swal } from 'src/app/common/swal.popup';
import { pattern } from 'src/app/common/regex.pattern';
import { registeSelectorData } from '../../store/user.selector';
import { Store, select } from '@ngrx/store';
import { saveRegiterData } from '../../store/user.action';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit,AfterViewInit {

  inCorrect: boolean = false;
  emailUsed: boolean = false;
  phoneUsed: boolean = false;
  nameError: boolean = false;
  phoneError: boolean = false;
  error: boolean = false
  isMoved = false;
  loginForm!: FormGroup;
  registerForm!:FormGroup
  loginSubmit: boolean = false;
  signupSubmit: boolean = false;
  private subscription1!: Subscription;
  private subscription2!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserAuthService,
    private router: Router,private store: Store<Register>,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', [Validators.required, Validators.pattern(pattern.password)]],
    });
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(pattern.phone)]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
      cpassword: ['', [Validators.required]],
    });
    this.store.pipe(select(registeSelectorData)).subscribe((data) => {
      if (data) {
        this.registerForm.patchValue(data)
      }
    })
  }
  
  SubmitLogin() {
    this.loginSubmit = true;
    if (this.loginForm.valid) {
      this.verifyUser(this.loginForm.value);
    }
    this.destroyError()
  }

  submitSignUp(){
    this.error = false
    this.signupSubmit = true;
    this.formValid()
    if (!this.error && this.registerForm.valid) {
      this.store.dispatch(saveRegiterData({ register: this.registerForm.value }))
      this.registerUser();
    }
    this.destroyError();
  }
  

  verifyUser(formData: Login) {
    const details = formData;
    this.subscription1 = this.userService.verifyLogin(details).subscribe(
      (res: LoginReturn) => {
        if (res.message) {
          swal('error', res.message);
        } else {
          localStorage.setItem('userToken', res.token);
          const data = this.userService.getTokenData()
          localStorage.setItem('userId', data._id);
          this.router.navigate(['/']);
        }
      }, (error) => {
        showError(error)
      });
  }

  registerUser(): void {
    const email = <string>this.registerForm.value.email;
    this.userService.registerUser(this.registerForm.value).subscribe(res => {
      if (res.success) {
        this.subscription2 = this.userService.sendMail(email).subscribe(
          (res) => {
            if (res.success) {
              localStorage.setItem('otp', res.otp);
              this.router.navigate(['/auth/verify']);
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
    switch (this.signupSubmit) {
      case !name.trim() || !isNaN(name):
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
      this.loginSubmit = false;
      this.signupSubmit = false;
      this.nameError = false;
      this.phoneError = false;
      this.inCorrect = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }

  private scrollToTop(): void {
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  moveDiv() {
    this.isMoved = !this.isMoved;
  }

  ngAfterViewInit(): void {
    this.scrollToTop()
  }
}
