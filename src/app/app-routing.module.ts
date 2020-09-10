import { LoginComponent } from './core/auth/login/login.component';
import { AdminModule } from './modules/admin/admin.module';
import { AppContainerComponent } from './core/app-container/app-container.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },

  {
    path: 'admin', loadChildren: () =>
      import('@modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login', component: LoginComponent
  },

  {
    path: '', component: AppContainerComponent,
    children: [


      {
        path: 'home', loadChildren: () =>
          import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: '**', loadChildren: () =>
          import('./core/not-found/not-found.module').then(m => m.NotFoundModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
