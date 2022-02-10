import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionComponent } from './planificacion.component';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { NewTareaPlanificacionComponent } from './components/new-tarea-planificacion/new-tarea-planificacion.component';
import { EditTareaPlanificacionComponent } from './components/edit-tarea-planificacion/edit-tarea-planificacion.component';
import { NewPlanificacionProyectoComponent } from './components/new-planificacion-proyecto/new-planificacion-proyecto.component';

import { NewCapituloPlanificacionComponent } from './components/new-capitulo-planificacion/new-capitulo-planificacion.component';
import { EditCapituloPlanificacionComponent } from './components/edit-capitulo-planificacion/edit-capitulo-planificacion.component';
import { EditPlanificacionProyectoComponent } from './components/edit-planificacion-proyecto/edit-planificacion-proyecto.component';
@NgModule({
  declarations: [
    PlanificacionComponent,
    GanttChartComponent,
    NewTareaPlanificacionComponent,
    EditTareaPlanificacionComponent,
    NewPlanificacionProyectoComponent,
    NewCapituloPlanificacionComponent,
    EditCapituloPlanificacionComponent,
    EditPlanificacionProyectoComponent,
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
