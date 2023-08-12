import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Trainers } from '../../services/admin-interface';
import { Store, select } from '@ngrx/store';
import { fetchTrainersData } from '../../store/admin.action';
import { trainersSelectorData } from '../../store/admin.selector';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { swal, swalConfirm, swalError } from 'src/app/common/swal.popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit, OnDestroy, AfterViewInit {

  pdfShow: boolean = false; 
  private subscription1!: Subscription;
  private subscription2!: Subscription;

  dataSource = new MatTableDataSource<Trainers>();
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  displayedColumns: string[] = ['position','image','name', 'email', 'documents', 'request', 'action'];

  constructor(private store: Store<Trainers[]>, private adminService: AdminAuthService) { }

  ngOnInit(): void {
    this.fetchTrainers()
  }

  approveTrainer(id: string) {
    swalConfirm("You won't be able to revert this!").then((res) => {
      if (res.isConfirmed) {
        this.subscription1 = this.adminService.approveTrainer(id, true).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchTrainers()
            } else {
              swal('error', 'Trainer not found')
            }
          }, (error) => {
            swalError(error)
          })
      }
    })

  }

  accessTrainer(id: string, access: boolean) {
    swalConfirm().then((res) => {
      if (res.isConfirmed) {
        this.subscription2 = this.adminService.trainerAccess(id, access).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchTrainers()
            } else {
              swal('error', 'Trainer not found')
            }
          }, (error) => {
            swalError(error)
          })
      }
    })
  }

  fetchTrainers() {
    this.store.dispatch(fetchTrainersData())
    this.store.pipe(select(trainersSelectorData)).subscribe(data=>{
      this.dataSource.data = data
    })
  }

  show(file: string) {
    console.log(file);
    
    this.adminService.getPdfFileUrl(file).subscribe((data) => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      this.pdfShow = true
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe()
    if (this.subscription2) this.subscription2.unsubscribe()
  }

}
