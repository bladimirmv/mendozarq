import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditProyectoComponent } from '@modules/proyectos/components/edit-proyecto/edit-proyecto.component';

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
        path: 'proyectos', loadChildren: () =>
          import('@modules/proyectos/proyectos.module').then(m => m.ProyectosModule)
      },
      {
        path: 'personal', loadChildren: () =>
          import('@modules/personal/personal.module').then(m => m.PersonalModule)
      },

      {
        path: 'producto', loadChildren: () =>
          import('@modules/producto/producto.module').then(m => m.ProductoModule)
      },

      {
        path: 'categoria-producto', loadChildren: () =>
          import('@modules/categoria-producto/categoria-producto.module').then(m => m.CategoriaProductoModule)
      },

      {
        path: 'comentario-producto', loadChildren: () =>
          import('@modules/comentario-producto/comentario-producto.module').then(m => m.ComentarioProductoModule)
      },
      {
        path: 'venta-producto', loadChildren: () =>
          import('@modules/venta-producto/venta-producto.module').then(m => m.VentaProductoModule)
      },

      {

        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },

    ]

  },
  {
    path: 'proyecto/:id', component: ProyectoComponent,
    children: [
      {
        path: '', redirectTo: 'description', pathMatch: 'full'
      },
      {
        path: 'descripcion', component: EditProyectoComponent
      },
      {
        path: 'cronograma', loadChildren: () =>
          import('@modules/cronograma/cronograma.module').then(m => m.CronogramaModule)
      },
      {
        path: 'visitas', loadChildren: () =>
          import('@modules/visitas/visitas.module').then(m => m.VisitasModule)
      },
      {
        path: 'participantes', loadChildren: () =>
          import('@modules/participantes/participantes.module').then(m => m.ParticipantesModule)
      },

      {
        path: 'documentos', loadChildren: () =>
          import('@modules/documentos/documentos.module').then(m => m.DocumentosModule)
      },
      {
        path: 'servicios', loadChildren: () =>
          import('@modules/servicio/servicio.module').then(m => m.ServicioModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
