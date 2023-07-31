import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Blog } from '../services/trainer.interface';
import { InitailProfile } from './trainer.interface';

export const blogsSelectorState = createFeatureSelector<Blog[]>('blogs');
export const profileSelectorState = createFeatureSelector<InitailProfile>('profile');

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
