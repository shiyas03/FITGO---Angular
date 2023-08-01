import { Component, OnInit } from '@angular/core';
import { Workout } from '../../services/user.interface';
import { Store, select } from '@ngrx/store';
import { fetchWorkoutsData } from '../../store/user.action';
import { workoutsSelectorData } from '../../store/user.selector';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {

  workouts$!: Observable<Workout[]>

  constructor(private store: Store<Workout[]>, private router: Router) { }

  ngOnInit(): void {
    this.store.dispatch(fetchWorkoutsData())
    this.workouts$ = this.store.pipe(select(workoutsSelectorData))
  }

  showWorkout(id: string) {
    const data = { id: id };
    const navigationExtras: NavigationExtras = {
      state: data,
    };
    this.router.navigate(['workouts/view'], navigationExtras);
  }
}
