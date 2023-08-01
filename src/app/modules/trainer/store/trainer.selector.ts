import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Blog, Workout } from '../services/trainer.interface';
import { InitailProfile } from './trainer.interface';

export const blogsSelectorState = createFeatureSelector<Blog[]>('blogs');
export const profileSelectorState = createFeatureSelector<InitailProfile>('profile');
export const workoutsSelectorState = createFeatureSelector<Workout[]>('workouts');

export const blogSelectorData = createSelector(
  blogsSelectorState,
  (state: Blog[]) => state,
);

export const blogFilterData = (id: string) =>
  createSelector(blogsSelectorState, (state: Blog[]) => {
    const _id = <string[]>Object.values(id);
    return state.find((blog) => blog._id === _id[0]);
  });

export const profileSelectorData = createSelector(
  profileSelectorState,
  (state: InitailProfile) => state.trainer
);

export const workoutsSelectorData = createSelector(
  workoutsSelectorState,
  (state: Workout[]) => state
)

export const workoutFilterData = (id: string) =>
  createSelector(workoutsSelectorData, (state: Workout[]) => {
    const workout = state.find((data) => data._id == id)
    return workout
  })