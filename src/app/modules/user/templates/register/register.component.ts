import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Register, RegisterReturn } from '../../services/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {

  submit: boolean = false
  inCorrect: boolean = false
  emailUsed: boolean = false
  phoneUsed: boolean = false
  registerForm!: FormGroup;
  nameError: boolean = false;
  phonePattern: string = '^[0-9]+$'
  passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$'
  private subscription1!: Subscription;
  private subscription2!: Subscription;

  constructor(private fb: FormBuilder,
    public userService: UserAuthService,
    private router: Router,
    private store: Store<{ register: Register }>
  ) {
    this.submit = false
    this.nameError = false
    localStorage.removeItem('otp')
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.phonePattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      cpassword: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.submit = true
    const { name, email, password, cpassword } = this.registerForm.value
    if (!name.trim()) {
      this.nameError = true
      setTimeout(() => {
        this.nameError = false
      }, 2000)
    } else if (cpassword === password && this.registerForm.valid) {
      this.registerUser()
    } else {
      this.inCorrect = true
      setTimeout(() => {
        this.inCorrect = false
      }, 2000)
    }
  }

  registerUser(): void {
    const registerData: Register = this.registerForm.value;
    this.subscription1 = this.userService.registerUser(registerData).subscribe((res:RegisterReturn) => {
      if (res.emailError == true) {
        this.emailUsed = true
      } else if (res.phoneError == true) {
        this.phoneUsed = true
      } else {
        if (res.id) {
          localStorage.setItem('id', res.id)
          this.subscription2 = this.userService.sendMail(res.id).subscribe((res) => {
            if (res.success) {
              localStorage.setItem('otp',res.otp)
              this.router.navigate(['/otp'])
            }
          })
        }
      }
      setTimeout(() => {
        this.emailUsed = false
        this.phoneUsed = false
      }, 3000)
    })
  }

  ngOnDestroy(): void {
    if(this.subscription1) this.subscription1.unsubscribe()
    if(this.subscription2) this.subscription2.unsubscribe()
  }
}
