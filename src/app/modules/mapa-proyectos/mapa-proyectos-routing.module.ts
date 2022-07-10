import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaProyectosComponent } from './mapa-proyectos.component';

const routes: Routes = [{ path: '', component: MapaProyectosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaProyectosRoutingModule { }
