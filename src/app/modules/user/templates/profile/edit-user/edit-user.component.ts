import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fetchProfileDetails } from '../../../store/user.action';
import { profileSelectorData } from '../../../store/user.selector';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProfileDetails } from '../../../store/user';
import { UserAuthService } from '../../../services/user-auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SuccessComponent } from 'src/app/modules/trainer/templates/details/success/success.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  editForm!: FormGroup
  pattern: RegExp = /^\d+$/
  submit: boolean = false
  nameError: boolean = false

  constructor(private fb: FormBuilder, private store: Store<ProfileDetails>, private dialog: MatDialogRef<SuccessComponent>) {
  }

  ngOnInit(): void {
    const id = <string>localStorage.getItem('id')
    this.store.dispatch(fetchProfileDetails({ id }))

    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      age: ['', [Validators.required, Validators.pattern(this.pattern)]],
      height: ['', [Validators.required, Validators.pattern(this.pattern)]],
      weight: ['', [Validators.required, Validators.pattern(this.pattern)]],
    })

    this.store.pipe(select(profileSelectorData)).subscribe(data => {
      if (data) {
        this.editForm.patchValue(data)
      }
    })
  }

  onSubmit() {
    const { name, phone, age, height, weight } = this.editForm.value
    if (!name.trim()) {
      this.nameError = true
      setTimeout(() => {
        this.nameError = false
      }, 3000)
    } else {
      this.dialog.close(this.editForm.value)
    }
  }
}
