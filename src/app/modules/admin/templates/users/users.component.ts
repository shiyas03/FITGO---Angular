import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Users } from '../../store/admin.interface';
import { fetchUsersAction } from '../../store/admin.action';
import { usersSelectorData } from '../../store/admin.selector';
import { Observable, Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { swalConfirm, swalError } from 'src/app/helpers/swal.popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscription!: Subscription;

  dataSource$ = new MatTableDataSource<Users>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'name', 'email', 'action'];

  constructor(
    private store: Store<{ users: Users[] }>,
    private adminServices: AdminAuthService,
  ) { }

  ngOnInit(): void {
    this.fetchUsers()
  }

  accessUser(id: string, access: boolean) {
    swalConfirm().then((res) => {
      if (res.isConfirmed) {
        this.subscription = this.adminServices.userAccess(id, access).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchUsers()
            }
          }, (error) => {
            swalError(error)
          });
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource$.paginator = this.paginator;
  }

  fetchUsers() {
    this.store.dispatch(fetchUsersAction());
    this.store.pipe(select(usersSelectorData)).subscribe((data) => {
      this.dataSource$.data = data
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
