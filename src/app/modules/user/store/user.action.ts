import { createAction, props } from "@ngrx/store";
import { Blog, ProfileDetails, Register, Trainer, User } from "./user";
import { Workout } from "../services/user.interface";

export const saveRegiterData = createAction('[Register API] User Register Details', props<{ register: Register }>())

export const fetchUserData = createAction("[User API] Fetch User",
    props<{ id: string }>()
)
export const fetchUserDataSuccess = createAction("[User API] Fetch User Success",
    props<{ user: User }>()
)
export const fetchUserFailure = createAction("[User API] Fetch Error",
    props<{ error: string }>()
)

export const fetchProfileDetails = createAction("[Profile API] Fetch Profile Details",
    props<{ id: string }>()
)
export const fetchProfileSuccess = createAction('[Profile API] Fetch Profile Success',
    props<{ details: ProfileDetails }>()
)

export const fetchBlogData = createAction('[Blog API] Fetch Blog Data')
export const fetchBlogDataSuccess = createAction('[Blog API] Fetch Blog Data Success',
    props<{ blogs: Blog[] }>()
)

export const fetchTrainersData = createAction('[Trainers API] Fetch Trainers Data')
export const fetchTrainersDataSuccess = createAction('[Trainers API] Fetch Trainers Data Success',
    props<{ trainers: Trainer[] }>()
)

export const fetchWorkoutsData = createAction('[Workout API] Fetch Workouts Data')
export const fetchWorkoutsDataSuccess = createAction('[Workout API] Fetch Workouts Data Success',
    props<{ workouts: Workout[] }>()
)