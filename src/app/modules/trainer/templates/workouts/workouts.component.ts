import { Component, OnInit } from '@angular/core';
import { NewWorkoutComponent } from './new-workout/new-workout.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {

  constructor( private dialog: MatDialog,){}

  ngOnInit(): void {
      
  }
  
  showForm() {
    const dialogRef: MatDialogRef<NewWorkoutComponent> = this.dialog.open(
      NewWorkoutComponent,
      {
        width: '700px',
      },
    );
    dialogRef.afterClosed().subscribe();
  }
}
