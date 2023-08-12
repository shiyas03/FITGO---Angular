import { createReducer, on } from "@ngrx/store";
import { Blog, UserInitail, profileInital, Trainer, RegisterInitial } from "./user";
import { fetchUserFailure, 
    fetchUserDataSuccess, 
    fetchProfileSuccess, 
    fetchBlogDataSuccess, 
    fetchTrainersDataSuccess, 
    fetchWorkoutsDataSuccess, 
    saveRegiterData, 
    fetchPaymentSuccess } from "./user.action";
import { PaymentDetails, Workout } from "../services/user.interface";


export const InitialRegisterState: RegisterInitial = { register: null }
export const registerReducer = createReducer(
    InitialRegisterState,
    on(saveRegiterData, (_state, { register }) => {
        return { register }
    })
)

export const InitialUserState: UserInitail = { user: null }
export const userReducer = createReducer(
    InitialUserState,
    on(fetchUserDataSuccess, (_state, { user }) => {
        return { user }
    }),
    on(fetchUserFailure, (_state, { error }) => _state)
)

export const InitialProfileState: profileInital = { details: null }
export const profileReducer = createReducer(
    InitialProfileState,
    on(fetchProfileSuccess, (_state, { details }) => {
        return { details }
    }),
    on(fetchUserFailure, (_state, { error }) => _state)
)

const InitialBlogsState: Blog[] = []
export const blogsReducer = createReducer(
    InitialBlogsState,
    on(fetchBlogDataSuccess, (_state, { blogs }) => {
        return blogs
    })
)

const InitialTrainerState: Trainer[] = []
export const trainerReducer = createReducer(
    InitialTrainerState,
    on(fetchTrainersDataSuccess, (_state, { trainers }) => {
        return trainers
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