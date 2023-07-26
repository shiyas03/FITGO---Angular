import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Users } from '../../store/admin.interface';
import { fetchUsersAction } from '../../store/admin.action';
import { usersSelectorData } from '../../store/admin.selector';
import { Observable, Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { swalConfirm, swalError } from 'src/app/helpers/swal.popup';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users$!: Observable<Users[]>;
  private subscription!: Subscription;

  constructor(
    private store: Store<{ users: Users[] }>,
    private adminServices: AdminAuthService,
  ) {}

  ngOnInit(): void {
    this.fetchUsers()
  }

  accessUser(id: string, access: boolean) {
    swalConfirm().then((res)=>{
      if(res.isConfirmed){
        this.subscription = this.adminServices.userAccess(id, access).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchUsers()
            }
          },(error)=>{
            swalError(error)
          });
      }
    })
  }

  fetchUsers(){
    this.store.dispatch(fetchUsersAction());
    this.users$ = this.store.pipe(select(usersSelectorData));
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
