import { createReducer, on } from "@ngrx/store";
import { Trainers, Users } from "./admin.interface";
import { fetchBlogDataSuccess, fetchPaymentSuccess, fetchTrainerDataSuccess, fetchUsersDataSuccess, fetchWorkoutsDataSuccess } from "./admin.action";
import { Blog, PaymentDetails, Workout } from "../services/admin-interface";

const InitialUserState: Users[] = []
export const usersReducer = createReducer(
    InitialUserState,
    on(fetchUsersDataSuccess, (_state, { users }) => {
        return users
    })
)

const InitialTrainerState: Trainers[] = []
export const trainerReducer = createReducer(
    InitialTrainerState,
    on(fetchTrainerDataSuccess, (_state, { trainers }) => {
        return trainers
    })
)

const InitialBlogsState: Blog[] = []
export const blogsReducer = createReducer(
    InitialBlogsState,
    on(fetchBlogDataSuccess, (_state, { blogs }) => {
        return blogs
    })
)

export const InitialWorkoutsState: Workout[] = []
export const workoutReducer = createReducer(
  InitialWorkoutsState,
  on(fetchWorkoutsDataSuccess, (_state, { workouts }) => workouts)
)

export const InitialPaymentsState: PaymentDetails[] = []
export const paymentReducer = createReducer(
    InitialPaymentsState,
    on(fetchPaymentSuccess,(_state, { payments })=> payments)
)