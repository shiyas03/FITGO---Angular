import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Workout } from '../../../services/user.interface';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { singleWorkoutData, workoutsSelectorData } from '../../../store/user.selector';
import { fetchWorkoutsData } from '../../../store/user.action';

@Component({
  selector: 'app-workout-view',
  templateUrl: './workout-view.component.html',
  styleUrls: ['./workout-view.component.css']
})
export class WorkoutViewComponent implements OnInit {

  workout$!:Observable<Workout | undefined>

  constructor(private route: ActivatedRoute, private store: Store<Workout>){}

  ngOnInit(): void {
      this.route.paramMap.subscribe(()=>{
        if(history.state){
          const id = history.state.id
          this.store.dispatch(fetchWorkoutsData())
          this.workout$ = this.store.pipe(select(singleWorkoutData(id)))
        }
      })
  }
  
}
