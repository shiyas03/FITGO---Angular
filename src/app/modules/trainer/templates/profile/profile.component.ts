import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { decodeToken } from 'src/app/common/token.decode';
import { Profile } from '../../store/trainer.interface';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { fetchTrainerData } from '../../store/trainer.action';
import { profileSelectorData } from '../../store/trainer.selector';
import Swal from 'sweetalert2';
import { TrainerAuthService } from '../../services/trainer-auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  trainer$!: Observable<Profile | null>;
  private subscription!: Subscription;
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef | undefined;

  constructor(private store: Store<Profile>, private trainerService : TrainerAuthService) { }

  ngOnInit(): void {
    const token = <string>localStorage.getItem('trainerToken');
    const { id, name, email } = decodeToken(token);
    this.fetchUser(id)
  }

  onFileSelected(event: Event){
    const file = <File>(event.target as HTMLInputElement)?.files?.[0];
    if (file && this.isValidFileType(file)) {
      const formData = new FormData();
      formData.append('image', file, file.name);
      const id = <string>localStorage.getItem('trainerId')
      this.subscription = this.trainerService.uploadProfileImage(formData,id).subscribe(res=>{
        if(res.success){
          this.fetchUser(id)
        }
      })
    } else {
      Swal.fire('Only PNG and JPG are allowed');
    }
  }

  openFileInput(){
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
    }
  }

  fetchUser(id:string){
    this.store.dispatch(fetchTrainerData({ id }));
    this.trainer$ = this.store.pipe(select(profileSelectorData));
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe()
  }

}
