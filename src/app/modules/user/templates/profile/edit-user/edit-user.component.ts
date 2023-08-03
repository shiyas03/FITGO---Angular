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
import { pattern } from 'src/app/helpers/regex.pattern';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  editForm!: FormGroup
  submit: boolean = false
  nameError: boolean = false
  ageError:boolean = false

  constructor(private fb: FormBuilder, private store: Store<ProfileDetails>, private dialog: MatDialogRef<SuccessComponent>) {
  }

  ngOnInit(): void {
    const id = <string>localStorage.getItem('id')
    this.store.dispatch(fetchProfileDetails({ id }))

    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(pattern.phone)]],
      age: ['', [Validators.required, Validators.pattern(pattern.numeric)]],
      height: ['', [Validators.required, Validators.pattern(pattern.numeric)]],
      weight: ['', [Validators.required, Validators.pattern(pattern.numeric)]],
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
    } else if (age < 15) {
      this.ageError = true
    }else{
      this.dialog.close(this.editForm.value)
    }
    this.destroyError()
  }

  destroyError(){
    setTimeout(() => {
      this.nameError = false
      this.ageError = false
    }, 3000)
  }
}
