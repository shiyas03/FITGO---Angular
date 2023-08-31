import { Component, OnInit, OnDestroy, ElementRef,AfterViewInit } from '@angular/core';
import { Workout } from '../../services/user.interface';
import { Store, select } from '@ngrx/store';
import { fetchWorkoutsData } from '../../store/user.action';
import { workoutsSelectorData } from '../../store/user.selector';
import { Observable, Subscription, map } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit, OnDestroy,AfterViewInit {

  workouts$!: Observable<Workout[]>
  notFound:boolean = true
  subcription!:Subscription
  searchQuery: string = '';
  selectedMuscle: string = 'All';

  constructor(private store: Store<Workout[]>, private router: Router,private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.store.dispatch(fetchWorkoutsData())
    this.workouts$ = this.store.pipe(select(workoutsSelectorData))
    this.subcription = this.workouts$.subscribe(data=>{
      for(let value of data){
        if(value.publish == true){
          this.notFound = false
        }
      }
    })
  }

  applySearchFilter() {
    const trimmedQuery = this.searchQuery.trim();
    if (trimmedQuery === '') {
      this.workouts$ = this.store.pipe(select(workoutsSelectorData))
    }else{
      this.workouts$ = this.workouts$.pipe(
        map(workouts =>
          workouts.filter(workout =>
            workout.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        )
      );
    }
    console.log(this.notFound);
    
  }

  applyMuscleFilter() {
    if (this.selectedMuscle === 'All') {
      this.workouts$ = this.store.pipe(select(workoutsSelectorData))
    } else {
      this.workouts$ = this.workouts$.pipe(
        map(workouts =>
          workouts.filter(workout =>
            workout.muscle === this.selectedMuscle
          )
        )
      );
    }
  }


  ngAfterViewInit(): void {
  this.scrollToTop()      
  }

  private scrollToTop(): void {
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }


  showWorkout(id: string) {
    const data = { id: id };
    const navigationExtras: NavigationExtras = {
      state: data,
    };
    this.router.navigate(['workouts/view'], navigationExtras);
  }

  ngOnDestroy(): void {
    if(this.subcription) this.subcription.unsubscribe()
  }
}
