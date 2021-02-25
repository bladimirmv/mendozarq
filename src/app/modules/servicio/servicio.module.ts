import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { ServicioComponent } from './servicio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { NewServicioComponent } from './components/new-servicio/new-servicio.component';
import { EditServicioComponent } from './components/edit-servicio/edit-servicio.component';
import { SharedModule } from '@app/shared/shared.module';
import { CountServicioPipe } from './pipes/count-servicio.pipe';


@NgModule({
  declarations: [ServicioComponent, NewServicioComponent, EditServicioComponent, CountServicioPipe],
  imports: [
    CommonModule,
    ServicioRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class ServicioModule { }
