import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions, ColumnChartOptions, PieChartOptions } from './chart.types';
import { Blog, Payment, Workout } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchBlogData, fetchPaymentData, fetchWorkoutsData } from '../../store/trainer.action';
import { blogSelectorData, paymentSelectorData, workoutsSelectorData } from '../../store/trainer.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  userChartOptions!: Partial<ChartOptions>;
  trainerChartOptions!: Partial<ChartOptions>;
  pieChartOptions!: Partial<PieChartOptions>;
  chartOptions!: Partial<ColumnChartOptions>;
  users: number = 0
  blogs: number = 0
  workouts: number = 0
  trainerIncome: number = 0
  GrandTotal: number = 0
  profitIncome: number = 0
  trainerId!: string;

  constructor(private _userStore: Store<Payment[]>,private _blogStore: Store<Blog[]>,private _workoutStore: Store<Workout[]>) { }

  ngOnInit(): void {
    this.trainerId = <string>localStorage.getItem('trainerId');
    this.totalUsers()
    this.totalBlogs()
    this.totalWorkouts()
  }

  totalUsers() {
    const trainerId = this.trainerId
    this._userStore.dispatch(fetchPaymentData({ trainerId }))
    this._userStore.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        const uniqueSet: string[] = []
        data.filter(obj => {
          const found = uniqueSet.find(data => data === obj.userId._id)
          if (!found) {
            uniqueSet.push(obj.userId._id)
          }
        })
        this.users = uniqueSet.length
      })
  }

  totalBlogs(){
    this._blogStore.dispatch(fetchBlogData());
    this._blogStore.pipe(select(blogSelectorData)).subscribe(data => {
      this.blogs = 0
      data.forEach(data=>{
        if(data.trainerId._id === this.trainerId){
          this.blogs++  
        }
      })
    })
  }

  totalWorkouts(){
    this._workoutStore.dispatch(fetchWorkoutsData())
    this._workoutStore.pipe(select(workoutsSelectorData)).subscribe(data=>{
      this.workouts = 0
      data.forEach(data=>{
        if(data.trainerId._id === this.trainerId){
          this.workouts++
        }
      })
    })
  }
}
