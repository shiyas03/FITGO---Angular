import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { TrainerAuthService } from '../services/trainer-auth.service';
import {
  fetchBlogData,
  fetchBlogDataSuccess,
  fetchTrainerData,
  fetchTrainerDataSuccess,
} from './trainer.action';
import { map, switchMap, tap } from 'rxjs';
import { Blog } from '../services/trainer.interface';
import { Profile } from './trainer.interface';

@Injectable()
export class trainerEffects {
  constructor(
    private actions$: Actions,
    private trainerService: TrainerAuthService,
  ) {}

  loadAllBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchBlogData),
      switchMap(() =>
        this.trainerService
          .fetchBlogs()
          .pipe(map((data: Blog[]) => fetchBlogDataSuccess({ blogs: data }))),
      ),
    ),
  );

  loadTrainerProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTrainerData),
      switchMap((action) =>
        this.trainerService
          .fetchProfileDetails(action.id)
          .pipe(map((data: Profile) => fetchTrainerDataSuccess({ trainer: data })),
          ),
      ),
    ),
  );
}
