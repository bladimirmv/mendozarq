import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionComponent } from './planificacion.component';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { NewTareaPlanificacionComponent } from './new-tarea-planificacion/new-tarea-planificacion.component';
import { EditTareaPlanificacionComponent } from './edit-tarea-planificacion/edit-tarea-planificacion.component';
import { NewPlanificacionProyectoComponent } from './new-planificacion-proyecto/new-planificacion-proyecto.component';
import { NewCapituloComponent } from './new-capitulo/new-capitulo.component';

@NgModule({
  declarations: [
    PlanificacionComponent,
    GanttChartComponent,
    NewTareaPlanificacionComponent,
    EditTareaPlanificacionComponent,
    NewPlanificacionProyectoComponent,
    NewCapituloComponent,
  ],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PlanificacionModule {}
