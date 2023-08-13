import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../../services/trainer-auth.service';
import { pattern } from 'src/app/common/regex.pattern';
import { Subscription } from 'rxjs';
import { profileSelectorData } from '../../../store/trainer.selector';
import { Store, select } from '@ngrx/store';
import { Profile } from '../../../store/trainer.interface';
import { swalError } from 'src/app/common/swal.popup';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {

  updateForm!: FormGroup
  submit: boolean = false

  private subscription!: Subscription

  constructor(private _fb: FormBuilder, 
    private _trainerService: TrainerAuthService,
    private _store:Store<Profile>,
    private _dialog: MatDialogRef<UpdateProfileComponent>) { }

  ngOnInit(): void {
    this.updateForm = this._fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(pattern.phone)]],
      about: ['', [Validators.required]],
    })
    this._store.pipe(select(profileSelectorData)).subscribe(data=>{
      if(data){
        this.updateForm.patchValue(data)
      }
    })
  }

  onSubmit() {
    this.submit = true
    if (this.updateForm.valid) {
      this.update()
    }
    setTimeout(() => {
      this.submit = false
    }, 2000)
  }

  update() {
    const id = this._trainerService.trainerId()
    const data = this.updateForm.value
    this.subscription = this._trainerService.updateProfile(id, data).subscribe(
      (res)=>{
        if(res == true){
          this._dialog.close('Profile updated successfully')
        }
      },(error)=>{
        swalError(error)
      }
    )
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe()
  }
}
