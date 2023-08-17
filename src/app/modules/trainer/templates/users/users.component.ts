import { Component, OnInit, ViewChild } from '@angular/core';
import { Payment } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData } from '../../store/trainer.action';
import { paymentSelectorData } from '../../store/trainer.selector';
import { swalError } from 'src/app/common/swal.popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserSingleViewComponent } from './user-single-view/user-single-view.component';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dataSource$ = new MatTableDataSource<Payment>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'user', 'contact', 'validity', 'actions'];

  constructor(private _store: Store<Payment[]>, 
    private _dialog: MatDialog, 
    private _trainerService: TrainerAuthService,
    private _router:Router) { }

  ngOnInit(): void {
    const trainerId = <string>localStorage.getItem('trainerId');
    this._store.dispatch(fetchPaymentData({ trainerId }))
    this._store.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        this.dataSource$.data = data
      }, (error) => {
        swalError(error)
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource$.paginator = this.paginator;
  }

  viewUser(id: string) {
    const dialogRef: MatDialogRef<UserSingleViewComponent> = this._dialog.open(
      UserSingleViewComponent,
      {
        width: '600px',
        data: { id: id },
      },
    );
    dialogRef.afterClosed().subscribe();
  }

  chatWith(userId: string) {
    const trainerId = <string>localStorage.getItem('trainerId')
    const data = {
      user: userId,
      trainer: trainerId,
    }
    this._trainerService.createConnection(data).subscribe((res) => {
      if (res) {
        this._router.navigate(['trainer/chat']);
      }
    })
  }
}
