import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './modules/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: 'trainer', loadChildren: () => import('./modules/trainer/trainer.module').then((m) => m.TrainerModule)
  },
  {
    path:'404', component:NotFoundPageComponent
  },
  {
    path: '**', redirectTo: '404',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
