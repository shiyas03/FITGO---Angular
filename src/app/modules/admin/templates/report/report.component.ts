import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentDetails } from '../../services/admin-interface';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData } from '../../store/admin.action';
import { paymentSelectorData } from '../../store/admin.selector';
import { swalError } from 'src/app/common/swal.popup';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy, AfterViewInit {

  fromDate!: Date;
  toDate!: Date;
  dateError: boolean = false

  dataSource$ = new MatTableDataSource<PaymentDetails>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'date', 'user', 'trainer', 'payment'];

  constructor(private _store: Store<PaymentDetails[]>,
    public datepipe: DatePipe,
    public currencypipe: CurrencyPipe,) { }

  ngOnInit(): void {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setMonth(this.fromDate.getMonth() - 1);
    this.fetchData()
  }

  handleSubmit() {
    if (this.fromDate > this.toDate) {
      this.dateError = true
    } else {
      this.fetchData()
    }
  }

  exportToPDF() {
    let prepare: any[] = [];
    this.dataSource$.filteredData.forEach((e: PaymentDetails, i) => {
      var tempObj = [];
      tempObj.push(i + 1)
      tempObj.push(this.datepipe.transform(e.paidDate, 'dd-MM-yyyy'));
      tempObj.push(e.userId.name);
      tempObj.push(e.trainerId.name);
      tempObj.push(this.currencypipe.transform(e.amount, 'INR'));
      prepare.push(tempObj);
    });

    const doc = new jsPDF();
    autoTable(doc, {
      styles: { fontSize: 9 },
      head: [['no', 'date', 'user', 'trainer', 'payment']],
      body: prepare
    })
    doc.save('report.pdf')
  }

  ngAfterViewInit() {
    this.dataSource$.paginator = this.paginator;
  }

  fetchData() {
    this._store.dispatch(fetchPaymentData())
    this._store.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        const filteredData = data.filter(data => {
          const paidDate = new Date(data.paidDate);
          return paidDate >= this.fromDate && paidDate <= this.toDate;
        });
        this.dataSource$.data = filteredData
      }, (error) => {
        swalError(error)
      })
  }

  ngOnDestroy() {
  }
}
