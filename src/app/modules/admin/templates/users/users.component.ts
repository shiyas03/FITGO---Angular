import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Users } from '../../store/admin.interface';
import { fetchUsersAction } from '../../store/admin.action';
import { usersSelectorData } from '../../store/admin.selector';
import { Observable, Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  users$!: Observable<Users[]>;
  private subscription1!: Subscription;
  private subscription2!: Subscription;

  constructor(private store: Store<{ users: Users[] }>, private adminServices: AdminAuthService) { }

  ngOnInit(): void {
    this.store.dispatch(fetchUsersAction())
    this.users$ = this.store.pipe(select(usersSelectorData))
  }

  blockUser(id: string) {
    this.subscription1 = this.adminServices.userAccess(id, false).subscribe((res) => {
      if (res.success == true) {
        this.store.dispatch(fetchUsersAction())
        this.users$ = this.store.pipe(select(usersSelectorData))
      }
    })
  }
  unblockUser(id: string) {
    this.subscription2 = this.adminServices.userAccess(id, true).subscribe((res) => {
      if (res.success == true) {
        this.store.dispatch(fetchUsersAction())
        this.users$ = this.store.pipe(select(usersSelectorData))
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe()
    if (this.subscription2) this.subscription2.unsubscribe()
  }
}
