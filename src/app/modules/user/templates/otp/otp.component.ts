import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User } from '../../store/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { fetchUserData } from '../../store/user.action';
import { userSelectorData } from '../../store/user.selector';
import { showError, swal } from '../../../../helpers/swal.popup';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit, OnDestroy {
  userEmail!: string;
  otpForm!: FormGroup;
  user$!: Observable<User | null>;
  submit: boolean = false;
  userId!: string | null;
  email!: string | null;
  private subscription!: Subscription;

  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  @ViewChild('input6') input6!: ElementRef;

  constructor(
    private store: Store<User>,
    private fb: FormBuilder,
    private router: Router,
    private userServices: UserAuthService,
  ) {
    this.submit = false;
    this.otpForm = this.fb.group({
      input1: ['', [Validators.required]],
      input2: ['', [Validators.required]],
      input3: ['', [Validators.required]],
      input4: ['', [Validators.required]],
      input5: ['', [Validators.required]],
      input6: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = localStorage.getItem('userId');
    if (id) {
      this.store.dispatch(fetchUserData({ id }));
      this.user$ = this.store.pipe(select(userSelectorData));
    }
  }

  onSubmit() {
    this.submit = true;
    const enteredotp = Object.values(this.otpForm.value);
    let combinedOTP = '';
    for (let value of enteredotp) {
      combinedOTP += value;
    }

    if (this.otpForm.valid) {
      this.verifyOtp(combinedOTP);
    } else {
      swal('error', 'Enter 6 digit OTP');
    }
  }

  verifyOtp(otp: string) {
    const generatedOtp = <string>localStorage.getItem('otp');
    const id = <string>localStorage.getItem('userId');
    if (generatedOtp == otp) {
      const details = { id: id, access: true };
      this.subscription = this.userServices.verifyOTP(details).subscribe(
        (res) => {
          if (res.success) {
            this.router.navigate(['/details']);
            localStorage.removeItem('otp');
          }
        },
        (error) => {
          showError(error)
        },
      );
    } else {
      swal('error', 'Incorrect OTP');
    }
  }

  //auto focus on input fields
  onInput(event: Event, inputName: string): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const isBackspace = value.length === 0;

    if (isBackspace) {
      switch (inputName) {
        case 'input2':
          this.input1.nativeElement.focus();
          break;
        case 'input3':
          this.input2.nativeElement.focus();
          break;
        case 'input4':
          this.input3.nativeElement.focus();
          break;
        case 'input5':
          this.input4.nativeElement.focus();
          break;
        case 'input6':
          this.input5.nativeElement.focus();
          break;
      }
    } else if (value.length > 0 && value.trim() !== '') {
      switch (inputName) {
        case 'input1':
          this.input2.nativeElement.focus();
          break;
        case 'input2':
          this.input3.nativeElement.focus();
          break;
        case 'input3':
          this.input4.nativeElement.focus();
          break;
        case 'input4':
          this.input5.nativeElement.focus();
          break;
        case 'input5':
          this.input6.nativeElement.focus();
          break;
        case 'input6':
          break;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
