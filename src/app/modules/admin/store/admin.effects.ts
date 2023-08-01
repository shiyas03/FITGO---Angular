import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminAuthService } from '../services/admin-auth.service';
import { map, switchMap } from 'rxjs';
import { fetchBlogData, 
    fetchBlogDataSuccess, 
    fetchTrainerDataSuccess, 
    fetchTrainersData, 
    fetchUsersAction, 
    fetchUsersDataSuccess, 
    fetchWorkoutsData, 
    fetchWorkoutsDataSuccess } from './admin.action';
import { Blog, Trainers, Users } from './admin.interface';
import { Workout } from '../services/admin-interface';

@Injectable()
export class AdminEffect {

    constructor(private action$: Actions, private adminService: AdminAuthService) { }

    loadAllUsers$ = createEffect(() =>
        this.action$.pipe(
            ofType(fetchUsersAction),
            switchMap(() => {
                return this.adminService.fetchUsers()
                    .pipe(
                        map((data: Users[]) => fetchUsersDataSuccess({ users: data }))
                    )
            })
        )
    )

    loadAllTrainers$ = createEffect(() =>
        this.action$.pipe(
            ofType(fetchTrainersData),
            switchMap(() => {
                return this.adminService.fetchTrainers()
                    .pipe(
                        map((data: Trainers[]) => fetchTrainerDataSuccess({ trainers: data }))
                    )
            })
        ))

    loadAllBlogs$ = createEffect(() =>
        this.action$.pipe(
            ofType(fetchBlogData),
            switchMap(() =>
                this.adminService.fetchBlogs().pipe(
                    map((data: Blog[]) => fetchBlogDataSuccess({ blogs: data }))
                )
            )
        )
    )

    loadAllWorkouts$ = createEffect(() =>
    this.action$.pipe(
      ofType(fetchWorkoutsData),
      switchMap(() =>
        this.adminService.fetchWorkouts()
          .pipe(map((data: Workout[]) => fetchWorkoutsDataSuccess({ workouts: data }))))
    ))
}