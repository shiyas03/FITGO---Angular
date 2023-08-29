import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentDetails } from '../../services/admin-interface';
import { MatPaginator } from '@angular/material/paginator';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData } from '../../store/admin.action';
import { paymentSelectorData } from '../../store/admin.selector';
import { swal, swalConfirm, swalError } from 'src/app/common/swal.popup';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit, AfterViewInit {

  dataSource$ = new MatTableDataSource<PaymentDetails>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'payment_id', 'Validity', 'user', 'status', 'trainer', 'payment'];

  constructor(private _store: Store<PaymentDetails[]>, private _adminService: AdminAuthService) { }

  ngOnInit(): void {
    this.fetchData()
  }

  ngAfterViewInit() {
    this.dataSource$.paginator = this.paginator;
  }

  fetchData() {
    this._store.dispatch(fetchPaymentData())
    this._store.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        this.dataSource$.data = data
      }, (error) => {
        swalError(error)
      })
  }

}
