import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresupuestosProyectoRoutingModule } from './presupuestos-proyecto-routing.module';
import { PresupuestosProyectoComponent } from './presupuestos-proyecto.component';
import { PresupuestosModule } from '../presupuestos/presupuestos.module';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [PresupuestosProyectoComponent],
  imports: [
    CommonModule,
    PresupuestosProyectoRoutingModule,
    MaterialModule,
    SharedModule,
    PresupuestosModule
  ]
})
export class PresupuestosProyectoModule { }
