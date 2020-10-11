import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitaAsistenciaRoutingModule } from './visita-asistencia-routing.module';
import { VisitaAsistenciaComponent } from './visita-asistencia.component';


@NgModule({
  declarations: [VisitaAsistenciaComponent],
  imports: [
    CommonModule,
    VisitaAsistenciaRoutingModule
  ]
})
export class VisitaAsistenciaModule { }
