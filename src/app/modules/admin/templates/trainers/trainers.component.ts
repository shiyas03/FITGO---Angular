import { Component, OnInit, OnDestroy } from '@angular/core';
import { Trainers } from '../../services/admin-interface';
import { Store, select } from '@ngrx/store';
import { fetchTrainersData } from '../../store/admin.action';
import { trainersSelectorData } from '../../store/admin.selector';
import { Observable, Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { swal, swalConfirm, swalError } from 'src/app/helpers/swal.popup';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit, OnDestroy {

  pdfShow: boolean = false;
  trainers$!: Observable<Trainers[]>
  private subscription1!: Subscription;
  private subscription2!: Subscription;

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
    this.trainers$ = this.store.pipe(select(trainersSelectorData))
  }

  show(file: string) {
    this.adminService.getPdfFileUrl(file).subscribe((data) => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      this.pdfShow = true
    })
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe()
    if (this.subscription2) this.subscription2.unsubscribe()
  }

}
