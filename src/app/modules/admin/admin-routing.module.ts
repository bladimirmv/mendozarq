import { PresupuestoPoryectoResolverService } from './../../core/services/mendozarq/presupuesto-poryecto-resolver.service';
import { VentasOnlineComponent } from './../venta-producto/components/ventas-online/ventas-online.component';

import { UsuarioResolverService } from './../../core/resolvers/usuario-resolver.service';
import { PlanificacionResolverService } from '@core/resolvers/planificacion.resolver.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { VisitaComponent } from './components/visita/visita.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DescripcionProyectoComponent } from './../proyectos/components/descripcion-proyecto/descripcion-proyecto.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'perfil',
        resolve: {
          usuario: UsuarioResolverService,
        },
        loadChildren: () =>
          import('@modules/perfil/perfil.module').then((m) => m.PerfilModule),
      },
      {
        path: 'reporteMendozarq',
        loadChildren: () =>
          import('@modules/reporte-mendozarq/reporte-mendozarq.module').then(
            (m) => m.ReporteMendozarqModule
          ),
      },

      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'proyectos',
        loadChildren: () =>
          import('@modules/proyectos/proyectos.module').then(
            (m) => m.ProyectosModule
          ),
      },
      {
        path: 'personal',
        loadChildren: () =>
          import('@modules/personal/personal.module').then(
            (m) => m.PersonalModule
          ),
      },

      {
        path: 'producto',
        loadChildren: () =>
          import('@modules/producto/producto.module').then(
            (m) => m.ProductoModule
          ),
      },

      {
        path: 'categoria-producto',
        loadChildren: () =>
          import('@modules/categoria-producto/categoria-producto.module').then(
            (m) => m.CategoriaProductoModule
          ),
      },

      {
        path: 'opiniones-producto',
        loadChildren: () =>
          import('@modules/opinion-producto/opinion-producto.module').then(
            (m) => m.OpinionProductoModule
          ),
      },
      {
        path: 'venta-producto',
        resolve: {
          usuario: UsuarioResolverService,
        },
        loadChildren: () =>
          import('@modules/venta-producto/venta-producto.module').then(
            (m) => m.VentaProductoModule
          ),
      },
      {
        path: 'categoria-proyecto',
        loadChildren: () =>
          import('@modules/categoria-proyecto/categoria-proyecto.module').then(
            (m) => m.CategoriaProyectoModule
          ),
      },
      {
        path: 'presupuestos',
        loadChildren: () =>
          import('@modules/presupuestos/presupuestos.module').then(
            (m) => m.PresupuestosModule
          ),
      },
      {
        path: 'ventas-online',
        resolve: {
          usuario: UsuarioResolverService,
        },
        component: VentasOnlineComponent,
      },

      {
        path: 'proveedor',
        loadChildren: () =>
          import('@modules/proveedor/proveedor.module').then(
            (m) => m.ProveedorModule
          ),
      },
      {
        path: 'recurso',
        loadChildren: () =>
          import('@modules/recurso/recurso.module').then(
            (m) => m.RecursoModule
          ),
      },

      {
        path: 'recursos',
        loadChildren: () =>
          import('@modules/recurso/recurso.module').then(
            (m) => m.RecursoModule
          ),
      },
      {
        path: 'categoria-recurso',
        loadChildren: () =>
          import('@modules/categoria-recurso/categoria-recurso.module').then(
            (m) => m.CategoriaRecursoModule
          ),
      },
      {
        path: 'herramienta',
        loadChildren: () =>
          import('@modules/herramienta/herramienta.module').then(
            (m) => m.HerramientaModule
          ),
      },
    ],
  },
  {
    path: 'proyecto/:uuid',
    component: ProyectoComponent,
    children: [
      {
        path: '',
        redirectTo: 'descripcion',
        pathMatch: 'full',
      },
      {
        path: 'descripcion',
        component: DescripcionProyectoComponent,
      },
      {
        path: 'planificacion',
        resolve: {
          planificacion: PlanificacionResolverService,
        },
        loadChildren: () =>
          import('@modules/planificacion/planificacion.module').then(
            (m) => m.PlanificacionModule
          ),
      },
      {
        path: 'visitas',
        loadChildren: () =>
          import('@modules/visitas/visitas.module').then(
            (m) => m.VisitasModule
          ),
      },
      {
        path: 'participantes',
        loadChildren: () =>
          import('@modules/participantes/participantes.module').then(
            (m) => m.ParticipantesModule
          ),
      },

      {
        path: 'documentos',
        loadChildren: () =>
          import('@modules/documentos/documentos.module').then(
            (m) => m.DocumentosModule
          ),
      },
      {
        path: 'servicios',
        loadChildren: () =>
          import('@modules/servicio/servicio.module').then(
            (m) => m.ServicioModule
          ),
      },
      {
        path: 'presupuesto-proyecto',
        runGuardsAndResolvers: 'always',
        resolve: {
          presupuesto: PresupuestoPoryectoResolverService,
        },
        loadChildren: () =>
          import(
            '@modules/presupuestos-proyecto/presupuestos-proyecto.module'
          ).then((m) => m.PresupuestosProyectoModule),
      },

      {
        path: 'jitsiMeet',
        loadChildren: () =>
          import('@modules/jitsi-meet/jitsi-meet.module').then(
            (m) => m.JitsiMeetModule
          ),
      },
    ],
  },
  {
    path: 'visita/:uuid',
    component: VisitaComponent,
    children: [
      {
        path: '',
        redirectTo: 'participantes',
        pathMatch: 'full',
      },
      {
        path: 'participantes',
        loadChildren: () =>
          import(
            '@modules/participante-visita/participante-visita.module'
          ).then((m) => m.ParticipanteVisitaModule),
      },
      {
        path: 'observacion-personal',
        loadChildren: () =>
          import(
            '@modules/observacion-personal/observacion-personal.module'
          ).then((m) => m.ObservacionPersonalModule),
      },
      {
        path: 'observacion-servicio',
        loadChildren: () =>
          import(
            '@modules/observacion-servicio/observacion-servicio.module'
          ).then((m) => m.ObservacionServicioModule),
      },
      {
        path: 'observacion-obra',
        loadChildren: () =>
          import('@modules/observacion-obra/observacion-obra.module').then(
            (m) => m.ObservacionObraModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
