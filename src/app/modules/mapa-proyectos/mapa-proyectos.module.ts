import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaProyectosRoutingModule } from './mapa-proyectos-routing.module';
import { MapaProyectosComponent } from './mapa-proyectos.component';


@NgModule({
  declarations: [MapaProyectosComponent],
  imports: [
    CommonModule,
    MapaProyectosRoutingModule
  ]
})
export class MapaProyectosModule { }
