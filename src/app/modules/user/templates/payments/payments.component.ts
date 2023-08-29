import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PaymentDetails } from '../../services/user.interface';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData } from '../../store/user.action';
import { paymentSelectorData } from '../../store/user.selector';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit,AfterViewInit {

  payments!: Observable<PaymentDetails>
  isPayment: boolean = false
  dataSource$ = new MatTableDataSource<PaymentDetails>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'payment_id', 'validity', 'trainer', 'amount','status'];

  payments$!:Observable<PaymentDetails[]>

  constructor(private _store: Store<PaymentDetails>) { }

  ngOnInit(): void {
    const userId = <string>localStorage.getItem('userId');
    this._store.dispatch(fetchPaymentData({ userId }))
    this.payments$ = this._store.pipe(select(paymentSelectorData))
    this.payments$.subscribe((data) => {
      this.dataSource$.data = data
      if (data) {
        data.length === 0 ? this.isPayment = false : this.isPayment = true
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource$.paginator = this.paginator;
  }
}
