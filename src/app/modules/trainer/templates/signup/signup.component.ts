import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Router } from '@angular/router';
import { pattern } from '../../../../common/regex.pattern';
import { Register, Registeration } from '../../services/trainer.interface';
import { Subscription } from 'rxjs';
import { swalError } from 'src/app/common/swal.popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  submit: boolean = false
  inCorrect: boolean = false
  emailUsed: boolean = false;
  phoneError: boolean = false;
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
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(pattern.phone),
        ],
      ],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      cpassword: ['', [Validators.required]]
    })
  }

  onSubmit() {
    this.submit = true
    const { name, email,phone, password, cpassword } = this.registerForm.value
    if(isNaN(phone)){
      this.phoneError = true
    }else if (cpassword === password) {
      if (this.registerForm.valid) {
        this.registerUser()
      }
    } else {
      this.inCorrect = true
    }
    this.destroyError()
  }

  registerUser(): void {
    const details: Register = this.registerForm.value
    this.subscription = this.trainerService.registration(details).subscribe(
      (res: Registeration) => {
      if (res.email == true) {
        this.emailUsed = true
        setTimeout(() => {
          this.emailUsed = false
        }, 2000)
      } else {
        localStorage.setItem('trainerId', res.id)
        this.router.navigate(['/trainer/details'])
      }
    },(error)=>{
      swalError(error)
    })
  }

  destroyError(){
    setTimeout(() => {
      this.submit = false
      this.phoneError = false
      this.inCorrect = false
    }, 2000)
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }
}
