import { createReducer, on } from '@ngrx/store';
import { Blog } from '../services/trainer.interface';
import { InitailProfile } from './trainer.interface';
import {
  fetchBlogDataSuccess,
  fetchTrainerDataSuccess,
} from './trainer.action';

const InitialBlogsState: Blog[] = [];
export const blogsReducer = createReducer(
  InitialBlogsState,
  on(fetchBlogDataSuccess, (_state, { blogs }) => {
    return blogs;
  }),
);

export const InitialProfileState: InitailProfile = { trainer: null };
export const profileReducer = createReducer(
  InitialProfileState,
  on(fetchTrainerDataSuccess, (_state, { trainer }) => {
    return { trainer };
  }),
);
