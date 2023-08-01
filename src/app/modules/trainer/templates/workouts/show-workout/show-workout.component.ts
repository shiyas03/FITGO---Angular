import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Workout } from '../../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fetchWorkoutsData } from '../../../store/trainer.action';
import { workoutFilterData, workoutsSelectorData } from '../../../store/trainer.selector';

@Component({
  selector: 'app-show-workout',
  templateUrl: './show-workout.component.html',
  styleUrls: ['./show-workout.component.css']
})
export class ShowWorkoutComponent implements OnInit {

  workout$!: Observable<Workout | undefined>

  constructor(private store: Store<Workout[] | Workout>,@Inject(MAT_DIALOG_DATA) public data: {id:string}, public dialogRef: MatDialogRef<ShowWorkoutComponent>) { }

  ngOnInit(): void {
    this.workout$ = this.store.pipe(select(workoutFilterData(this.data.id)))
  }

  close() {
    this.dialogRef.close()
  }

}
