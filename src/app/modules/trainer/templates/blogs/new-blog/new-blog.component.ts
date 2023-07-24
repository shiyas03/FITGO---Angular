import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.component.html',
  styleUrls: ['./new-blog.component.css']
})
export class NewBlogComponent implements OnInit {

  blogForm!: FormGroup
  submit: boolean = false
  titleError: boolean = false
  formatError: boolean = false
  file!: File

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<NewBlogComponent>) {
    this.submit = false
    this.titleError = false
  }

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      blog: ['', [Validators.required]],
      template: [null, [Validators.required, this.fileTypeValidator]]
    })
  }

  onSubmit() {
    this.submit = true
    if (this.blogForm.valid) {
      const { title, category, blog } = this.blogForm.value
      const formData = new FormData();
      formData.append('details',title)
      formData.append('details',category)
      formData.append('details',blog)
      formData.append('details', this.file, this.file.name)
      this.dialog.close(formData)
    } else {
      this.formatError = true
      setTimeout(() => {
        this.formatError = false
      }, 2000)
    }
  }

  onFileSelected(event: Event) {
    this.file = <File>(event.target as HTMLInputElement)?.files?.[0];
  }

  fileTypeValidator(control: FormControl): { [key: string]: boolean } | null {
    const allowedFileTypes = ['png', 'jpg'];

    if (control.value) {
      const fileExtension = control.value.split('.').pop().toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

}
