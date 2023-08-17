import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Blog, Payment, Workout } from '../services/trainer.interface';
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

export const paymentSelectorState = createFeatureSelector<Payment[]>('payments')
export const paymentSelectorData = createSelector(
  paymentSelectorState,
  (state: Payment[]) => state
)

export const UserPaymentData = (id: string) => createSelector(
  paymentSelectorData, (state: Payment[]) =>{
    const user = state.find(data=> data.userId._id === id)
    return user?.userId
  } 
)