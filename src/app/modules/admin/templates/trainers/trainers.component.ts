import { Component, OnInit, OnDestroy } from '@angular/core';
import { Trainers } from '../../services/admin-interface';
import { Store, select } from '@ngrx/store';
import { fetchTrainersData } from '../../store/admin.action';
import { trainersSelectorData } from '../../store/admin.selector';
import { Observable, Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit, OnDestroy {

  trainers$!: Observable<Trainers[]>
  private subscription1!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;

  constructor(private store: Store<Trainers[]>, private adminService: AdminAuthService) { }

  ngOnInit(): void {
    this.store.dispatch(fetchTrainersData())
    this.trainers$ = this.store.pipe(select(trainersSelectorData))
  }

  approveTrainer(id: string) {
    this.subscription1 = this.adminService.approveTrainer(id, true).subscribe((res) => {
      if (res.success == true) {
        this.store.dispatch(fetchTrainersData())
        this.trainers$ = this.store.pipe(select(trainersSelectorData))
      }
    })
  }

  blockTrainer(id: string) {
    this.subscription2 = this.adminService.trainerAccess(id,false).subscribe((res)=>{
      if(res.success == true){
        this.store.dispatch(fetchTrainersData())
        this.trainers$ = this.store.pipe(select(trainersSelectorData))
      }
    })
  }

  unblockTrainer(id: string) { 
    this.subscription3 = this.adminService.trainerAccess(id,true).subscribe((res)=>{
      if(res.success == true){
        this.store.dispatch(fetchTrainersData())
        this.trainers$ = this.store.pipe(select(trainersSelectorData))
      }
    })
  }

  ngOnDestroy(): void {
      if(this.subscription1) this.subscription1.unsubscribe()
      if(this.subscription2) this.subscription2.unsubscribe()
      if(this.subscription3) this.subscription3.unsubscribe()
  }

}
