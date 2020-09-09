import { AdminModule } from './modules/admin/admin.module';
import { AppContainerComponent } from './core/app-container/app-container.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [


  {
    path: 'admin', loadChildren: () =>
      import('@modules/admin/admin.module').then(m => m.AdminModule)
  },

  {
    path: 'login', loadChildren: () =>
      import('./core/auth/login/login.module').then(m => m.LoginModule)
  },

  {
    path: 'register', loadChildren: () =>
      import('./core/auth/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: '', component: AppContainerComponent,
    children: [
      {
        path: '', redirectTo: 'auth', pathMatch: 'full'
      },

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
