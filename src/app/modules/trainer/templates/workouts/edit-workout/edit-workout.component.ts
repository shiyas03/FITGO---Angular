import { Component, Inject } from '@angular/core';
import { Workout } from '../../../services/trainer.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../../services/trainer-auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { workoutFilterData } from '../../../store/trainer.selector';
import { Store, select } from '@ngrx/store';
import { swalError } from 'src/app/helpers/swal.popup';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.component.html',
  styleUrls: ['./edit-workout.component.css']
})
export class EditWorkoutComponent {

  workoutForm!: FormGroup
  submit!: boolean;
  titleError: boolean = false
  overviewError: boolean = false
  setsError: boolean = false
  videoError: boolean = false
  imageError: boolean = false
  video!: File
  thumbnail!: File
  workout$!: Observable<Workout | undefined>
  workoutId!:string;

  constructor(private fb: FormBuilder,
    private trainerService: TrainerAuthService,
    @Inject(MAT_DIALOG_DATA) private data: { id: string },
    private dialog: MatDialogRef<EditWorkoutComponent>,
    private store: Store<Workout[] | Workout>) { }

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
      thumbnails: ['', []],
      videos: ['', []]
    })
    this.workout$ = this.store.pipe(select(workoutFilterData(this.data.id)))
    this.workout$.subscribe(data => {
      if (data) {
        this.workoutForm.patchValue(data)
        this.workoutId = data._id
      }
    })
  }

  onSubmit() {
    this.submit = true
    if (this.workoutForm.valid && !this.videoError && !this.imageError) {
      this.workoutsUpload()
    }
    this.destroyError()
  }

  workoutsUpload() {
    const details: Workout = this.workoutForm.value
    const formData = new FormData();
    if(this.video) formData.append('files', this.video, this.video.name)
    if(this.thumbnail) formData.append('files', this.thumbnail, this.thumbnail.name)
    formData.append('files', details.title)
    formData.append('files', details.muscle)
    formData.append('files', details.level)
    formData.append('files', details.reps)
    formData.append('files', details.sets)
    formData.append('files', details.interval)
    formData.append('files', details.duration)
    formData.append('files', details.overview)
    this.trainerService.updateWorkouts(this.workoutId, formData).subscribe(res => {
      if(res == true){
        this.dialog.close(true)
      }
    },(error)=>{
      swalError(error)
    })
  }

  onVideoSelected(event: Event) {
    this.video = <File>(event.target as HTMLInputElement)?.files?.[0];
    if (this.video.name.split('.').includes('mp4')) {
      this.videoError = false
    } else {
      this.videoError = true
    }
  }

  onImageSelected(event: Event) {
    this.thumbnail = <File>(event.target as HTMLInputElement)?.files?.[0];
    this.fileTypeValidator(this.thumbnail)
  }

  fileTypeValidator(file: File) {
    const fileExtension = <string>file.name.split('.').pop()
    const allowedFileTypes = ['png', 'jpg', 'jpeg'];
    if (!allowedFileTypes.includes(fileExtension)) {
      this.imageError = true
    }else{
      this.imageError = false
    }
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
    }, 2000)
  }

}
