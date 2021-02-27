import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitasRoutingModule } from './visitas-routing.module';
import { VisitasComponent } from './visitas.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewVisitaProyectoComponent } from './components/new-visita-proyecto/new-visita-proyecto.component';
import { EditVisitaProyectoComponent } from './components/edit-visita-proyecto/edit-visita-proyecto.component';


@NgModule({
  declarations: [VisitasComponent, NewVisitaProyectoComponent, EditVisitaProyectoComponent],
  imports: [
    CommonModule,
    VisitasRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VisitasModule { }
