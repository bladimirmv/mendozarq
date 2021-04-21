import { CdkMaterialModule } from '@app/cdk-material.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresupuestosRoutingModule } from './presupuestos-routing.module';
import { PresupuestosComponent } from './presupuestos.component';
import { PresupuestoObraComponent } from './components/presupuesto-obra/presupuesto-obra.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPresupuestoComponent } from './components/new-presupuesto/new-presupuesto.component';
import { EditPresupuestoComponent } from './components/edit-presupuesto/edit-presupuesto.component';

@NgModule({
  declarations: [PresupuestosComponent, PresupuestoObraComponent, NewPresupuestoComponent, EditPresupuestoComponent],
  imports: [
    CommonModule,
    PresupuestosRoutingModule,
    SharedModule,
    CdkMaterialModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PresupuestosModule { }
