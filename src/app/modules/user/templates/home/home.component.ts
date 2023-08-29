import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { swal, swalError } from 'src/app/common/swal.popup';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  islogged: boolean = false
  userName!: string | null
  contactForm!: FormGroup
  submit: boolean = false

  constructor(private _fb: FormBuilder, private _userService: UserAuthService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('userToken')) {
      this.islogged = true;
    }
    this.contactForm = this._fb.group({
      fn: ['', [Validators.required]],
      sn: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    })
  }

  onSubmit() {
    this.submit = true
    this.destroyError()
    if (this.contactForm.valid) {
      const data = this.contactForm.value
      this._userService.contactMessage(data).subscribe(
        (res) => {
          if (res == true) {
            swal('success', 'Message received')
            this.contactForm.reset()
          } else {
            swal('error', 'try again!')
          }
        }, (error) => {
          swalError(error)
        })
    }
  }

  destroyError() {
    setTimeout(() => {
      this.submit = false
    }, 2000)
  }
}
