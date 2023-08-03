import { Component, OnInit, OnDestroy } from '@angular/core';
import { Workout } from '../../services/admin-interface';
import { Store, select } from '@ngrx/store';
import { fetchWorkoutsData } from '../../store/admin.action';
import { workoutsSelectorData } from '../../store/admin.selector';
import { Observable, Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { ShowWorkoutComponent } from './show-workout/show-workout.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { swal, swalConfirm } from 'src/app/helpers/swal.popup';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit, OnDestroy {

  workouts$!:Observable<Workout[]>
  subscription!:Subscription

  constructor(private store:Store<Workout[]>,private adminServices : AdminAuthService,private dialog: MatDialog ){}

  ngOnInit(): void {
    this.fetchData()
  }

  showWorkout(id:string){
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

  publishChange(id:string,change:boolean){
    swalConfirm().then((res)=>{
      if(res.isConfirmed){
        this.subscription = this.adminServices.publishWorkout(id,change).subscribe(res=>{
          if(res == true){
            this.fetchData()
          }else{
            swal('error',"could't update")
          }
        })
      }
    })
  }

  fetchData(){
    this.store.dispatch(fetchWorkoutsData())
    this.workouts$ = this.store.pipe(select(workoutsSelectorData))
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe()
  }
}
