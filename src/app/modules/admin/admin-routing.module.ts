import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'users', loadChildren: () =>
          import('@modules/users/users.module').then(m => m.UsersModule)
      },
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
