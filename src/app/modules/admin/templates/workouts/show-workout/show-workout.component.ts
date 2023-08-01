import { Component, Inject, OnInit } from '@angular/core';
import { Workout } from '../../../services/admin-interface';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { fetchWorkoutsData } from '../../../store/admin.action';
import { workoutFilterData, workoutsSelectorData } from '../../../store/admin.selector';

@Component({
  selector: 'app-show-workout',
  templateUrl: './show-workout.component.html',
  styleUrls: ['./show-workout.component.css']
})
export class ShowWorkoutComponent implements OnInit {

  workout$!: Observable<Workout | undefined>

  constructor(private store: Store<Workout[] | Workout>, @Inject(MAT_DIALOG_DATA) public data: {id:string}, public dialogRef: MatDialogRef<ShowWorkoutComponent>){}

  ngOnInit(): void {
    this.workout$ = this.store.pipe(select(workoutFilterData(this.data.id)))
  }

  close() {
    this.dialogRef.close()
  }
}
