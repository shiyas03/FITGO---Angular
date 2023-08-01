import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../../services/trainer-auth.service';
import { Workout } from '../../../services/trainer.interface';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-workout',
  templateUrl: './new-workout.component.html',
  styleUrls: ['./new-workout.component.css']
})
export class NewWorkoutComponent implements OnInit {

  workoutForm!: FormGroup
  submit!: boolean;
  titleError: boolean = false
  overviewError: boolean = false
  setsError: boolean = false
  videoError: boolean = false
  imageError: boolean = false
  video!: File
  thumbnail!:File

  constructor(private fb: FormBuilder, private trainerService:TrainerAuthService, private dialog: MatDialogRef<NewWorkoutComponent>) { }

  ngOnInit(): void {
    this.workoutForm = this.fb.group({
      title: ['', [Validators.required]],
      muscle: ['', [Validators.required]],
      level: ['', [Validators.required]],
      reps: ['', [Validators.required]],
      sets: ['', [Validators.required]],
      interval: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      overview: ['', [Validators.required]],
      thumbnail: ['', [Validators.required, this.fileTypeValidator]],
      video: ['', [Validators.required]]
    })
  }

  onSubmit() {
    this.submit = true
    if (this.workoutForm.valid && this.videoError == false) {
      this.workoutsUpload()
    } else {
      this.validate()
      this.imageError = true
    }
    this.destroyError()
  }

  workoutsUpload() {
    const details : Workout = this.workoutForm.value
    const formData = new FormData();
    formData.append('files', this.video, this.video.name)
    formData.append('files', this.thumbnail, this.thumbnail.name)
    formData.append('files', details.title)
    formData.append('files', details.muscle)
    formData.append('files', details.level)
    formData.append('files', details.reps)
    formData.append('files', details.sets)
    formData.append('files', details.interval)
    formData.append('files', details.duration)
    formData.append('files', details.overview)
    const id = <string>localStorage.getItem('trainerId')  
    this.trainerService.uploadWorkouts(id,formData).subscribe(res=>{
      this.dialog.close()
    })
    
  }

  onVideoSelected(event: Event) {
    this.video = <File>(event.target as HTMLInputElement)?.files?.[0];
    if (this.video.name.split('.').includes('mp4')) {
      this.videoError = false
    }else{
      this.videoError = true
    }
  }

  onImageSelected(event: Event){
    this.thumbnail = <File>(event.target as HTMLInputElement)?.files?.[0];
  }

  fileTypeValidator(control: FormControl): { [key: string]: boolean } | null {
    const allowedFileTypes = ['png', 'jpg', 'jpeg'];
    if (control.value) {
      const fileExtension = control.value.split('.').pop().toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  validate() {
    const { title, sets, overview } = this.workoutForm.value
    if (!title.trim()) {
      this.titleError = true
    }
    if (!overview.trim()) {
      this.overviewError = true
    }
    if (Number(sets) < 8) {
      this.setsError = true
    }
  }

  destroyError() {
    setTimeout(() => {
      this.submit = false
      this.titleError = false
      this.overviewError = false
      this.setsError = false
      this.imageError = false
    }, 2000)
  }

}
