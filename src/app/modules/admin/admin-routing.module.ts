import { ShowContrasenhaComponent } from './../users/components/show-contrasenha/show-contrasenha.component';
import { PresupuestoObraComponent } from '@modules/presupuestos/components/presupuesto-obra/presupuesto-obra.component';
import { VisitaComponent } from './components/visita/visita.component';
import { EditVisitaComponent } from '@modules/visitas/components/edit-visita/edit-visita.component';
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

        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'showusr', component: ShowContrasenhaComponent
      },
      {
        path: 'usuarios', loadChildren: () =>
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
        path: 'categoria-proyecto', loadChildren: () =>
          import('@modules/categoria-proyecto/categoria-proyecto.module').then(m => m.CategoriaProyectoModule)
      },
      {
        path: 'presupuestos-obras', loadChildren: () =>
          import('@modules/presupuestos/presupuestos.module').then(m => m.PresupuestosModule)
      },
      {
        path: 'reservas-producto', loadChildren: () =>
          import('@modules/reserva-producto/reserva-producto.module').then(m => m.ReservaProductoModule)
      },
      {
        path: 'importaciones', loadChildren: () =>
          import('@modules/importaciones/importaciones.module').then(m => m.ImportacionesModule)
      },
      {
        path: 'recursos', loadChildren: () =>
          import('@modules/recurso/recurso.module').then(m => m.RecursoModule)
      },
      {
        path: 'categoria-recurso', loadChildren: () =>
          import('@modules/categoria-recurso/categoria-recurso.module').then(m => m.CategoriaRecursoModule)
      },
      {
        path: 'herramienta', loadChildren: () =>
          import('@modules/herramienta/herramienta.module').then(m => m.HerramientaModule)
      },
    ]

  },
  {
    path: 'proyecto/:id', component: ProyectoComponent,
    children: [
      {
        path: '', redirectTo: 'descripcion', pathMatch: 'full'
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
      {
        path: 'presupuestos-obra', component: PresupuestoObraComponent
      }
    ]

  },
  {
    path: 'visita/:id', component: VisitaComponent,
    children: [
      {
        path: '', redirectTo: 'descripcion', pathMatch: 'full'
      },
      {
        path: 'descripcion', component: EditVisitaComponent
      },
      {
        path: 'obervacion-participante', loadChildren: () =>
          import('@modules/observacion-participante/observacion-participante.module').then(m => m.ObservacionParticipanteModule)
      },
      {
        path: 'obervacion-servicio', loadChildren: () =>
          import('@modules/observacion-servicio/observacion-servicio.module').then(m => m.ObservacionServicioModule)
      },
      {
        path: 'asistencia', loadChildren: () =>
          import('@modules/visita-asistencia/visita-asistencia.module').then(m => m.VisitaAsistenciaModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
