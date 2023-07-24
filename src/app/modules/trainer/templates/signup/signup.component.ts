import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Register, Registeration } from '../../services/trainer.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  submit: boolean = false
  inCorrect: boolean = false
  emailUsed: boolean = false;
  registerForm!: FormGroup;
  passwordPattern: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
  private subscription!: Subscription;

  constructor(private fb: FormBuilder,
    private trainerService: TrainerAuthService,
    private router: Router
  ) {
    this.submit = false
    this.emailUsed = false
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      cpassword: ['', [Validators.required]]
    })
  }

  onSubmit() {
    this.submit = true
    const { name, email, password, cpassword } = this.registerForm.value

    if (cpassword === password) {
      if (this.registerForm.valid) {
        this.registerUser()
      }
    } else {
      this.inCorrect = true
      setTimeout(() => {
        this.inCorrect = false
      }, 2000)
    }
  }

  registerUser(): void {
    const details: Register = this.registerForm.value
    this.subscription = this.trainerService.registration(details).subscribe((res: Registeration) => {
      if (res.email == true) {
        this.emailUsed = true
        setTimeout(() => {
          this.emailUsed = false
        }, 2000)
      } else {
        localStorage.setItem('trainerId', res.id)
        this.router.navigate(['/trainer/details'])
      }

    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }
}
