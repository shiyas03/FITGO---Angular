import { Component, OnInit } from '@angular/core';
import { Trainer } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fetchTrainersData } from '../../store/user.action';
import { trainerSelectorData } from '../../store/user.selector';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {

  trainers$! :Observable<Trainer[]>

  constructor(private store:Store<Trainer[]>){}
  ngOnInit(): void {
      this.store.dispatch(fetchTrainersData())
      this.trainers$ = this.store.pipe(select(trainerSelectorData))
  }
}
