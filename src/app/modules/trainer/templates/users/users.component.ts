import { Component,OnInit, ViewChild } from '@angular/core';
import { Payment } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData } from '../../store/trainer.action';
import { paymentSelectorData } from '../../store/trainer.selector';
import { swalError } from 'src/app/common/swal.popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dataSource$ = new MatTableDataSource<Payment>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'user', 'contact','validity','actions'];

  constructor(private _store: Store<Payment[]>){}

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
