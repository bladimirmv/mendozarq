import { AppContainerComponent } from './core/app-container/app-container.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'login', loadChildren: () =>
      import('./modules/login/login.module').then(m => m.LoginModule)
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
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
