import { createAction, props } from "@ngrx/store";
import { Blog } from "../services/trainer.interface";

export const fetchBlogData = createAction('[Blog API] Fetch Blog Data')
export const fetchBlogDataSuccess = createAction('[Blog API] Fetch Blog Data Success',
    props<{ blogs: Blog[] }>()
)
