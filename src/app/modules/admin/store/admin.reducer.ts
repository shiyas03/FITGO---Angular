import { createReducer, on } from "@ngrx/store";
import { Trainers, Users } from "./admin.interface";
import { fetchBlogDataSuccess, fetchTrainerDataSuccess, fetchUsersDataSuccess } from "./admin.action";
import { Blog } from "../services/admin-interface";

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