import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionServicioRoutingModule } from './observacion-servicio-routing.module';
import { ObservacionServicioComponent } from './observacion-servicio.component';


@NgModule({
  declarations: [ObservacionServicioComponent],
  imports: [
    CommonModule,
    ObservacionServicioRoutingModule
  ]
})
export class ObservacionServicioModule { }
