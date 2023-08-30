import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Workout } from '../../../services/user.interface';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { profileSelectorData, singleWorkoutData } from '../../../store/user.selector';
import { fetchProfileDetails, fetchWorkoutsData } from '../../../store/user.action';
import { UserAuthService } from '../../../services/user-auth.service';

@Component({
  selector: 'app-workout-view',
  templateUrl: './workout-view.component.html',
  styleUrls: ['./workout-view.component.css']
})
export class WorkoutViewComponent implements OnInit {

  workout$!: Observable<Workout | undefined>
  isStarted: boolean = false
  isFinished: boolean = false
  userId!:string
  workoutId!:string

  constructor(
    private _route: ActivatedRoute,
    private _store: Store<Workout>,
    private _userService: UserAuthService) { }

  ngOnInit(): void {
    this.userId = <string>localStorage.getItem('userId')
    this._route.paramMap.subscribe(() => {
      if (history.state) {
        this.workoutId = history.state.id
        const id = this.workoutId
        this._store.dispatch(fetchWorkoutsData())
        this.workout$ = this._store.pipe(select(singleWorkoutData(id)))
      }
    })
    const id = this.userId
    this._store.dispatch(fetchProfileDetails({ id }));
    this._store.pipe(select(profileSelectorData)).subscribe((data)=>{
      if(data){
        for(let value of data.workouts){
          const providedDate = new Date(value.date);
          const currentDate = new Date();
          if(value.workouts._id === this.workoutId && 
            providedDate.toDateString() === currentDate.toDateString() ){
            this.isFinished = true
          }
        }
      }
    })
  }

  started() {
    this.isStarted = true
  }

  finished(workoutId: string) {
    this._userService.updateWorkout(this.userId,workoutId).subscribe(
      (res)=>{
        if(res == true){
          this.isFinished = true
        }
      }
    )
  }

}
