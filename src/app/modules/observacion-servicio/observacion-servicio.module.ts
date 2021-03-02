import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionServicioRoutingModule } from './observacion-servicio-routing.module';
import { ObservacionServicioComponent } from './observacion-servicio.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ObservacionServicioComponent],
  imports: [
    CommonModule,
    ObservacionServicioRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ObservacionServicioModule { }
