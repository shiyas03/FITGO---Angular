import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Blog, Trainer, UserInitail, profileInital } from './user';
import { Workout } from '../services/user.interface';

export const userSelectorState = createFeatureSelector<UserInitail>('user');
export const userSelectorData = createSelector(
  userSelectorState,
  (state: UserInitail) => state.user,
);

export const profileSelectorState = createFeatureSelector<profileInital>('profile');
export const profileSelectorData = createSelector(
  profileSelectorState,
  (state: profileInital) => state.details,
);

export const blogsSelectorState = createFeatureSelector<Blog[]>('blogs');
export const blogSelectorData = createSelector(
  blogsSelectorState,
  (state: Blog[]) => state
);

export const singleBlogSelector = (id: string) =>
  createSelector(blogSelectorData, (state: Blog[]) => {
    const blog = state.find((data) => data._id === id);
    return blog;
  });


export const trainerSelectorState = createFeatureSelector<Trainer[]>('trainers')
export const trainerSelectorData = createSelector(
  trainerSelectorState,
  (state: Trainer[]) => state
)

export const workoutsSelectorState = createFeatureSelector<Workout[]>('workouts');
export const workoutsSelectorData = createSelector(
  workoutsSelectorState,
  (state: Workout[]) => state
)

export const singleWorkoutData = (id: string) =>
  createSelector(workoutsSelectorData, (state: Workout[]) => {
    const workout = state.find((data) => data._id == id)
    return workout
  })