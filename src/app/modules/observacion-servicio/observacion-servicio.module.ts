import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionServicioRoutingModule } from './observacion-servicio-routing.module';
import { ObservacionServicioComponent } from './observacion-servicio.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewObservacionServicioComponent } from './components/new-observacion-servicio/new-observacion-servicio.component';
import { EditObservacionServicioComponent } from './components/edit-observacion-servicio/edit-observacion-servicio.component';


@NgModule({
  declarations: [ObservacionServicioComponent, NewObservacionServicioComponent, EditObservacionServicioComponent],
  imports: [
    CommonModule,
    ObservacionServicioRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ObservacionServicioModule { }
