import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Payment } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData, fetchTrainerData } from '../../store/trainer.action';
import { paymentSelectorData, profileSelectorData } from '../../store/trainer.selector';
import { swalError } from 'src/app/common/swal.popup';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Observable } from 'rxjs';
import { Profile } from '../../store/trainer.interface';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  dataSource$ = new MatTableDataSource<Payment>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'payment_id', 'validity', 'user', 'status', 'your_status'];

  constructor(private _store: Store<Payment[]>,private _trainerService:TrainerAuthService) { }

  ngOnInit(): void {
    const trainerId = <string>localStorage.getItem('trainerId');
    this._store.dispatch(fetchPaymentData({ trainerId })) 
    this._store.pipe(select(paymentSelectorData)).subscribe(
      (data)=>{
        this.dataSource$.data = data
      },(error)=>{
        swalError(error)
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource$.paginator = this.paginator;
  }

}
