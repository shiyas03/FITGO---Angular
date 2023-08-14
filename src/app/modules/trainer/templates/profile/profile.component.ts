import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Profile } from '../../store/trainer.interface';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { fetchTrainerData } from '../../store/trainer.action';
import { profileSelectorData } from '../../store/trainer.selector';
import Swal from 'sweetalert2';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { swal, swalConfirm, swalError } from 'src/app/common/swal.popup';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  trainer$!: Observable<Profile | null>;
  private subscription1!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef | undefined;
  form!: FormGroup
  submit: boolean = false;
  revenue:number = 0

  constructor(private _store: Store<Profile>,
    private _trainerService: TrainerAuthService,
    private _fb: FormBuilder, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      service: ['', [Validators.required]]
    })
    this.fetchData()
    this.totalRevenue()
  }

  onFileSelected(event: Event) {
    const file = <File>(event.target as HTMLInputElement)?.files?.[0];
    if (file && this.isValidFileType(file)) {
      const formData = new FormData();
      formData.append('image', file, file.name);
      const id = <string>localStorage.getItem('trainerId')
      this.subscription1 = this._trainerService.uploadProfileImage(formData, id).subscribe(res => {
        if (res) {
          this.fetchData()
        }
      })
    } else {
      Swal.fire('Only PNG and JPG are allowed');
    }
  }

  openFileInput() {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
    }
  }

  fetchData() {
    const id = this._trainerService.trainerId()
    this._store.dispatch(fetchTrainerData({ id }));
    this.trainer$ = this._store.pipe(select(profileSelectorData));
  }

  services() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.value.service
      const id = this._trainerService.trainerId()
      this.subscription2 = this._trainerService.updateService(data, id).subscribe(
        (res) => {
          if (res == true) {
            swal('success', 'service added successfully')
            this.form.get('service')?.setValue('')
            this.fetchData()
          }
        }, (error) => {
          swalError(error)
        })
    }
    setTimeout(() => {
      this.submit = false
    }, 2000)
  }

  remove(data: string) {
    swalConfirm("You won't be able to revert this!").then((res) => {
      if (res.isConfirmed) {
        const id = this._trainerService.trainerId()
        this.subscription3 = this._trainerService.removeService(data, id).subscribe(
          (res) => {
            if (res == true) {
              swal('success', 'Service removed')
              this.fetchData()
            }
          }, (error) => {
            swalError(error)
          }
        )
      }
    })
  }

  editProfile() {
    const dialogRef: MatDialogRef<UpdateProfileComponent> =
      this._dialog.open(UpdateProfileComponent, {
        width: '400px'
      })
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        swal('success', res)
        this.fetchData()
      }
    })
  }

  totalRevenue(){
    this.trainer$.subscribe((data) => {
      if(data){
        for(let {amount} of data?.payments){
          this.revenue+=amount
        }
      }
    })
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  }


  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe()
    if (this.subscription2) this.subscription2.unsubscribe()
    if (this.subscription3) this.subscription3.unsubscribe()
  }

}
