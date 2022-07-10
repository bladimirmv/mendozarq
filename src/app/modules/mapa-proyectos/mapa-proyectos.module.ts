import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaProyectosRoutingModule } from './mapa-proyectos-routing.module';
import { MapaProyectosComponent } from './mapa-proyectos.component';

@NgModule({
  declarations: [MapaProyectosComponent],
  imports: [CommonModule, MapaProyectosRoutingModule, MaterialModule],
})
export class MapaProyectosModule {}
