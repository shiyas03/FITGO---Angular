import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SuccessComponent } from './success/success.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { showError } from 'src/app/helpers/swal.popup';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  detailForm!: FormGroup;
  submit: boolean = false;
  selectedFiles: string = '';
  selectedCertificates!: FileList;
  about!: string;
  formatError: boolean = false;
  selectedCV!: File;
  private subscription1!: Subscription;
  private subscription2!: Subscription;

  constructor(
    private fb: FormBuilder,
    private trainerServices: TrainerAuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.submit = false;
  }

  ngOnInit(): void {
    this.detailForm = this.fb.group({
      about: ['', [Validators.required]],
      cv: [null, [Validators.required, this.fileTypeValidator]],
      certificates: [null, [Validators.required, this.fileTypeValidator]],
    });
  }

  onSubmit() {
    this.formatError = false;
    this.submit = true;
    if (this.detailForm.valid) {
      this.sendDetails();
    } else {
      this.formatError = true;
      setTimeout(() => {
        this.formatError = false;
      }, 2000);
    }
  }

  onAboutChanged(event: Event) {
    this.about = (event.target as HTMLInputElement)?.value;
  }

  //for showin selected files
  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const fileNames = Array.from(files).map((file) => file.name);
      this.selectedFiles = fileNames.join(', ');
    }
    this.selectedCertificates = <FileList>(
      (event.target as HTMLInputElement).files
    );
  }

  onCvSelected(event: Event) {
    this.selectedCV = <File>(event.target as HTMLInputElement)?.files?.[0];
  }

  sendDetails() {
    const formData = new FormData();
    const id = <string>localStorage.getItem('trainerId');
    formData.append('details', this.about);
    formData.append('details', this.selectedCV, this.selectedCV.name);
    for (let i = 0; i < this.selectedCertificates.length; i++) {
      formData.append(
        'details',
        this.selectedCertificates[i],
        this.selectedCertificates[i].name,
      );
    }
    this.subscription1 = this.trainerServices.detailsUpload(formData, id).subscribe(
      (res) => {
        if (res.success == false) {
          const dialogRef: MatDialogRef<ErrorDialogComponent> =
            this.dialog.open(ErrorDialogComponent);
          this.subscription2 = dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/trainer/register']);
          });
        } else {
          const dialogRef: MatDialogRef<SuccessComponent> =
            this.dialog.open(SuccessComponent);
          this.subscription2 = dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/']);
          });
        }
      },(error)=>{
        showError(error)
      });
  }

  fileTypeValidator(control: FormControl): { [key: string]: boolean } | null {
    const allowedFileTypes = ['pdf', 'doc'];

    if (control.value) {
      const fileExtension = control.value.split('.').pop().toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }
}
