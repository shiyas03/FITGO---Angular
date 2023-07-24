import { createReducer, on } from "@ngrx/store";
import { fetchBlogDataSuccess } from "./trainer.action";
import { Blog } from "../services/trainer.interface";

const InitialBlogsState: Blog[] = []
export const blogsReducer = createReducer(
    InitialBlogsState,
    on(fetchBlogDataSuccess, (_state, { blogs }) => {
        return blogs
    })
)