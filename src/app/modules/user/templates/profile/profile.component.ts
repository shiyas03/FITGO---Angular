import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileDetails, works } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchProfileDetails } from '../../store/user.action';
import { Observable, Subscription } from 'rxjs';
import { profileSelectorData } from '../../store/user.selector';
import { UserAuthService } from '../../services/user-auth.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  details: boolean = true;
  workouts!: works[];
  history: boolean = false;
  activeLink: string = 'Details';
  details$!: Observable<ProfileDetails | null>;
  private subscription1!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;

  constructor(
    private _store: Store<ProfileDetails>,
    private _userServices: UserAuthService,
    private _dialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit(): void {
    const id = <string>localStorage.getItem('userId')
    if (id) {
      this.fetchData(id);
    }
  }

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  onFileSelected(event: Event) {
    const file = <File>(event.target as HTMLInputElement)?.files?.[0];
    if (file && this.isValidFileType(file)) {
      const formData = new FormData();
      formData.append('image', file, file.name);
      const id = <string>localStorage.getItem('userId')
      this.subscription1 = this._userServices
        .profileUpload(formData, id)
        .subscribe(() => {
          this.fetchData(id);
        });
    } else {
      Swal.fire('Only PNG and JPG are allowed');
    }
  }

  removeImage(id: string) {
    this.subscription3 = this._userServices.removeImage(id).subscribe((res) => {
      if (res.success == true) {
        this.fetchData(id);
      }
    });
  }

  editUser(id: string) {
    const dialogRef: MatDialogRef<EditUserComponent> =
      this._dialog.open(EditUserComponent);
    dialogRef.afterClosed().subscribe((res) => {
      this._userServices.updateDetails(res, id).subscribe((res) => {
        if (res.success == true) {
          this.fetchData(id);
        }
      });
    });
  }

  toWorkout(id: string) {
    const data = { id: id };
    const navigationExtras: NavigationExtras = {
      state: data,
    };
    this._router.navigate(['workouts/view'], navigationExtras);
  }

  fetchData(id: string) {
    this._store.dispatch(fetchProfileDetails({ id }));
    this.details$ = this._store.pipe(select(profileSelectorData));
    this.details$.subscribe(data => {
      if (data) {
       this.workouts = [...data.workouts].reverse()
      }
    }); 
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
  }
}
