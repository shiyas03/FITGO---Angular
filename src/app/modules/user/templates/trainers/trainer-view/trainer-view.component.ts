import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trainer } from '../../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchTrainersData } from '../../../store/user.action';
import { singleTrainerData, trainerSelectorData } from '../../../store/user.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trainer-view',
  templateUrl: './trainer-view.component.html',
  styleUrls: ['./trainer-view.component.css']
})
export class TrainerViewComponent implements OnInit {

  trainer$!: Observable<Trainer | undefined>

  constructor(private route: ActivatedRoute, private store: Store<Trainer>) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      if (history.state) {
        const id = history.state.id
        this.store.dispatch(fetchTrainersData())
        this.trainer$ = this.store.pipe(select(singleTrainerData(id)))
      }
    })
  }

}
