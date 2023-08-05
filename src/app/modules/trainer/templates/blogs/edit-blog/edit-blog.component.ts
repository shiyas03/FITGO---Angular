import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Blog } from '../../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchBlogData } from '../../../store/trainer.action';
import { blogFilterData } from '../../../store/trainer.selector';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../../services/trainer-auth.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit, OnDestroy {

  blogForm!: FormGroup
  submit: boolean = false
  formatError: boolean = false
  file!: File
  blog$!: Observable<Blog | undefined>
  trainer!: string;
  blog!:string
  subscription!: Subscription

  constructor(private fb: FormBuilder,
    private store: Store<Blog[] | Blog>,
    @Inject(MAT_DIALOG_DATA) private id: string,
    private dialog: MatDialogRef<EditBlogComponent>,
    private trainerService: TrainerAuthService) { }

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      blog: ['', [Validators.required]],
      thumbnail: [null,]
    })
    this.store.dispatch(fetchBlogData())
    this.blog$ = this.store.pipe(select(blogFilterData(this.id)))
    this.blog$.subscribe((data) => {
      if (data) {
        this.blogForm.patchValue(data)
        this.trainer = Object.values(data.trainerId)[0]
        this.blog = data._id
      }
    })
  }

  onFileSelected(event: Event) {
    this.file = <File>(event.target as HTMLInputElement)?.files?.[0];
    this.fileTypeValidator(this.file)
  }

  onSubmit() {
    this.submit = true
    if (this.blogForm.valid && !this.formatError) {
      const { title, category, blog } = this.blogForm.value
      const formData = new FormData();
      formData.append('details', title)
      formData.append('details', category)
      formData.append('details', blog)
      if (this.file) {
        formData.append('details', this.file, this.file.name)
      }
      this.subscription = this.trainerService.updateBlog(formData, this.blog).subscribe(res => {
        if (res == true) {
          this.dialog.close(true)
        }
      }, (error) => {
        this.dialog.close(error)
      })
    }
    this.dialog.close()
    this.destroyError()
  }

  fileTypeValidator(file: File) {
    const fileExtension = <string>file.name.split('.').pop()
    const allowedFileTypes = ['png', 'jpg', 'jpeg'];
    if (!allowedFileTypes.includes(fileExtension)) {
      this.formatError = true
    }else{
      this.formatError = false
    }
  }

  destroyError() {
    setTimeout(() => {
      this.submit = false
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }
}
