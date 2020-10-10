import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { ServicioComponent } from './servicio.component';


@NgModule({
  declarations: [ServicioComponent],
  imports: [
    CommonModule,
    ServicioRoutingModule
  ]
})
export class ServicioModule { }
