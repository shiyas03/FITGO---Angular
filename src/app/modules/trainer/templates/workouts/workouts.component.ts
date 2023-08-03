import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NewWorkoutComponent } from './new-workout/new-workout.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Workout } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchWorkoutsData } from '../../store/trainer.action';
import { workoutsSelectorData } from '../../store/trainer.selector';
import { Observable } from 'rxjs';
import { ShowWorkoutComponent } from './show-workout/show-workout.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit,AfterViewInit {

  dataSource$ = new MatTableDataSource<Workout>();
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  displayedColumns: string[] = ['position', 'thumbnail', 'title', 'muscle', 'action'];

  constructor(private dialog: MatDialog, private store: Store<Workout[]>) { }

  ngOnInit(): void {
    this.fetchData()
  }

  showForm() {
    const dialogRef: MatDialogRef<NewWorkoutComponent> = this.dialog.open(
      NewWorkoutComponent,
      {
        width: '700px',
      },
    );
    dialogRef.afterClosed().subscribe(()=>{
      this.fetchData()
    });
  }

  showWorkout(id: string) {
    const dialogRef: MatDialogRef<ShowWorkoutComponent> = this.dialog.open(
      ShowWorkoutComponent,
      {
        width: '700px',
        height: '700px',
        data: { id: id },
      },
    );
    dialogRef.afterClosed().subscribe();
  }

  fetchData(){
    this.store.dispatch(fetchWorkoutsData())
    this.store.pipe(select(workoutsSelectorData)).subscribe(data=>{
      this.dataSource$.data = data
    })
  }

  ngAfterViewInit(): void {
    this.dataSource$.paginator = this.paginator;
  }
}
