import { AppContainerComponent } from './core/app-container/app-container.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'auth', loadChildren: () =>
      import('./core/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: AppContainerComponent,
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home', loadChildren: () =>
          import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'contact-us', loadChildren: () =>
          import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule)
      },
      {
        path: 'about-us', loadChildren: () =>
          import('./modules/about-us/about-us.module').then(m => m.AboutUsModule)
      }
    ]
  },
  {
    path: '**', loadChildren: () =>
      import('./core/not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
