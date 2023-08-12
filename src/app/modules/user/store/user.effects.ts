import { Injectable } from "@angular/core";
import { ofType, Actions, createEffect } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { UserAuthService } from "../services/user-auth.service";
import {
    fetchUserFailure,
    fetchUserData,
    fetchUserDataSuccess,
    fetchProfileDetails,
    fetchProfileSuccess,
    fetchBlogData,
    fetchBlogDataSuccess,
    fetchTrainersData,
    fetchTrainersDataSuccess,
    fetchWorkoutsData,
    fetchWorkoutsDataSuccess,
    fetchPaymentData,
    fetchPaymentSuccess
} from "./user.action";
import { Blog, Trainer } from "./user";
import { PaymentDetails, Workout } from "../services/user.interface";


@Injectable()
export class userEffects {
    constructor(private actions$: Actions, private userService: UserAuthService) { }

    getUserData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchUserData),
            switchMap((action) => {
                return this.userService.fetchUser(action.id)
                    .pipe(
                        map((res) => fetchUserDataSuccess({ user: res })),
                        catchError((error) => of(fetchUserFailure({ error })))
                    )
            })
        ))

    getProfileData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchProfileDetails),
            switchMap((action) => {
                return this.userService.fetchProfileDetails(action.id)
                    .pipe(
                        map((res) => fetchProfileSuccess({ details: res })),
                        catchError((error) => of(fetchUserFailure({ error })))
                    )
            })
        )
    )

    loadAllBlogs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchBlogData),
            switchMap(() =>
                this.userService.fetchBlogs().pipe(
                    map((data: Blog[]) => fetchBlogDataSuccess({ blogs: data }))
                )
            )
        )
    )

    loadAllTrainers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchTrainersData),
            switchMap(() =>
                this.userService.fetchTrainers().pipe(
                    map((data: Trainer[]) => fetchTrainersDataSuccess({ trainers: data }))
                ))
        ))

    loadAllWorkouts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchWorkoutsData),
            switchMap(() =>
                this.userService.fetchWorkouts().pipe(
                    map((data: Workout[]) => fetchWorkoutsDataSuccess({ workouts: data }))))
        ))

    loadAllPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchPaymentData),
            switchMap((action) =>
                this.userService.fetchPayments(action.userId).pipe(
                    map((data: PaymentDetails[]) => fetchPaymentSuccess(({ payments: data })))
                )
            )
        )
    )
}
