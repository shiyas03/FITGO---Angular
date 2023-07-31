import { createAction, props } from '@ngrx/store';
import { Blog } from '../services/trainer.interface';
import { Profile } from './trainer.interface';

export const fetchBlogData = createAction('[Blog API] Fetch Blog Data');
export const fetchBlogDataSuccess = createAction(
  '[Blog API] Fetch Blog Data Success',
  props<{ blogs: Blog[] }>(),
);

export const fetchTrainerData = createAction(
  '[Trainer API] Fetch Trainer Data',
  props<{ id: string }>(),
);
export const fetchTrainerDataSuccess = createAction(
  '[Trainer API] Fetch Trainer Data Success',
  props<{ trainer: Profile }>(),
);
