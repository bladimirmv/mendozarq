import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresupuestosProyectoRoutingModule } from './presupuestos-proyecto-routing.module';
import { PresupuestosProyectoComponent } from './presupuestos-proyecto.component';
import { PresupuestosModule } from '../presupuestos/presupuestos.module';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { NewPresupuestoProyectoComponent } from './components/new-presupuesto-proyecto/new-presupuesto-proyecto.component';
import { PresupuestoProyectoComponent } from './components/presupuesto-proyecto/presupuesto-proyecto.component';

@NgModule({
  declarations: [
    PresupuestosProyectoComponent,
    NewPresupuestoProyectoComponent,
    PresupuestoProyectoComponent,
  ],
  imports: [
    CommonModule,
    PresupuestosProyectoRoutingModule,
    MaterialModule,
    SharedModule,
    PresupuestosModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PresupuestosProyectoModule {}
