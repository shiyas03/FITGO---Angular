import { createAction, props } from "@ngrx/store";
import { Blog, ProfileDetails, Register, Trainer, User } from "./user";
import {  PaymentDetails, Workout } from "../services/user.interface";

export const saveRegiterData = createAction('[Register API] User Register Details', props<{ register: Register }>())


//For fetching user email,accesss,name details
export const fetchUserData = createAction("[User API] Fetch User",
    props<{ id: string }>()
)
export const fetchUserDataSuccess = createAction("[User API] Fetch User Success",
    props<{ user: User }>()
)
export const fetchUserFailure = createAction("[User API] Fetch Error",
    props<{ error: string }>()
)

//For fetching user profile details
export const fetchProfileDetails = createAction("[Profile API] Fetch Profile Details",
    props<{ id: string }>()
)
export const fetchProfileSuccess = createAction('[Profile API] Fetch Profile Success',
    props<{ details: ProfileDetails }>()
)

//For fetching blog details
export const fetchBlogData = createAction('[Blog API] Fetch Blog Data')
export const fetchBlogDataSuccess = createAction('[Blog API] Fetch Blog Data Success',
    props<{ blogs: Blog[] }>()
)

//For fetching trainer details
export const fetchTrainersData = createAction('[Trainers API] Fetch Trainers Data')
export const fetchTrainersDataSuccess = createAction('[Trainers API] Fetch Trainers Data Success',
    props<{ trainers: Trainer[] }>()
)

//For fetching workouts details
export const fetchWorkoutsData = createAction('[Workout API] Fetch Workouts Data')
export const fetchWorkoutsDataSuccess = createAction('[Workout API] Fetch Workouts Data Success',
    props<{ workouts: Workout[] }>()
)


//For fetching payment details of user
export const fetchPaymentData = createAction('[Payment API] Fetch Payment Data',
    props<{ userId: string }>()
)
export const fetchPaymentSuccess = createAction('[Payment API] Fetch Payment Success',
    props<{ payments: PaymentDetails[] }>()
)