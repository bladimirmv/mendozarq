import { AdminGuard } from './core/guards/admin.guard';
import { RegisterComponent } from '@core/auth/register/register.component';
import { LoginComponent } from '@core/auth/login/login.component';
import { AppContainerComponent } from '@core/app-container/app-container.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [


  // {
  //   path: '', component: AppContainerComponent,
  //   children: [

  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },

  {
    canActivate: [AdminGuard],
    path: 'admin', loadChildren: () =>
      import('@modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'registro/:id', component: RegisterComponent
  },
  {
    path: 'perfil', loadChildren: () =>
      import('@modules/perfil/perfil.module').then(m => m.PerfilModule)
  },


  { path: 'participante-visita', loadChildren: () => import('./modules/participante-visita/participante-visita.module').then(m => m.ParticipanteVisitaModule) },
  {
    path: '**', loadChildren: () =>
      import('./core/not-found/not-found.module').then(m => m.NotFoundModule)
  }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
