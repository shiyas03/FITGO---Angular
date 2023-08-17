import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { SingleViewComponent } from 'src/app/modules/user/templates/blogs/single-view/single-view.component';
import { Payment, UserFull } from '../../../services/trainer.interface';
import { fetchPaymentData } from '../../../store/trainer.action';
import { UserPaymentData } from '../../../store/trainer.selector';
import { Observable } from 'rxjs';
import { User } from 'src/app/modules/user/store/user';
@Component({
  selector: 'app-user-single-view',
  templateUrl: './user-single-view.component.html',
  styleUrls: ['./user-single-view.component.css']
})
export class UserSingleViewComponent implements OnInit {

  user$!: Observable<UserFull | undefined>

  constructor(private _store: Store<Payment[]>, @Inject(MAT_DIALOG_DATA) public data: { id: string }, public dialogRef: MatDialogRef<SingleViewComponent>) { }

  ngOnInit(): void {
    const trainerId = <string>localStorage.getItem('trainerId')
    this._store.dispatch(fetchPaymentData({ trainerId }))
    this.user$ = this._store.pipe(select(UserPaymentData(this.data.id)))
  }

}
