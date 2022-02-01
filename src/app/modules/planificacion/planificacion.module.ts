import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionComponent } from './planificacion.component';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { NewTareaPlanificacionComponent } from './new-tarea-planificacion/new-tarea-planificacion.component';
import { EditTareaPlanificacionComponent } from './edit-tarea-planificacion/edit-tarea-planificacion.component';

@NgModule({
  declarations: [PlanificacionComponent, GanttChartComponent, NewTareaPlanificacionComponent, EditTareaPlanificacionComponent],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class PlanificacionModule {}
