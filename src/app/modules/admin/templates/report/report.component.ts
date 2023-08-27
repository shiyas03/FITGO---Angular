import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentDetails } from '../../services/admin-interface';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData } from '../../store/admin.action';
import { paymentSelectorData } from '../../store/admin.selector';
import { swalError } from 'src/app/common/swal.popup';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy, AfterViewInit {

  fromDate!: Date;
  toDate!: Date;

  details!: { users: number[], trainers: number[], payments: number[] };
  dataSource$ = new MatTableDataSource<{ users: number[], trainers: number[], payments: number[] }>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'date', 'users', 'trainers', 'payments'];

  constructor(private _store: Store<PaymentDetails[]>,) { }

  ngOnInit(): void {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setMonth(this.fromDate.getMonth() - 1);
    this.fetchData()
  }
  handleSubmit() {
    this.fetchData()
  }

  ngAfterViewInit() {
    this.dataSource$.paginator = this.paginator;
  }

  fetchData() {
    this._store.dispatch(fetchPaymentData())
    this._store.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        let paymentCount = 0
        data.forEach(data => {
          const paidDate = new Date(data.paidDate);
          if (paidDate >= this.fromDate && paidDate <= this.toDate) {
            paymentCount++
          }
        })
        this.details.payments.push(paymentCount)
      }, (error) => {
        swalError(error)
      })
  }

  ngOnDestroy() {

  }
}
