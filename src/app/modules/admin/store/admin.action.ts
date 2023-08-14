import { createAction, props } from "@ngrx/store";
import { Trainers, Users } from "./admin.interface";
import { Blog, PaymentDetails, Workout } from "../services/admin-interface";

export const fetchUsersAction = createAction('[Users API] Fetch Users')
export const fetchUsersDataSuccess = createAction('[Users API] Fetch Users Data',
    props<{ users: Users[] }>()
)

export const fetchTrainersData = createAction('[Trainers API] Fetch Trainer Data')
export const fetchTrainerDataSuccess = createAction('[Trainer API] Fetch Trainer Data Success',
    props<{ trainers: Trainers[] }>()
)

export const fetchBlogData = createAction('[Blog API] Fetch Blog Data')
export const fetchBlogDataSuccess = createAction('[Blog API] Fetch Blog Data Success',
    props<{ blogs: Blog[] }>()
)

export const fetchWorkoutsData = createAction('[Workout API] Fetch Workouts Data')
export const fetchWorkoutsDataSuccess = createAction('[Workout API] Fetch Workouts Data Success',
  props<{ workouts: Workout[] }>()
)

export const fetchPaymentData = createAction('[Payment API] Fetch Payments Data')
export const fetchPaymentSuccess = createAction('[Payment API] Fetch Payments Data Success',
    props<{ payments: PaymentDetails[] }>()
)