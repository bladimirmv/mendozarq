import { CdkMaterialModule } from '@app/cdk-material.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresupuestosRoutingModule } from './presupuestos-routing.module';
import { PresupuestosComponent } from './presupuestos.component';
import { PresupuestoObraComponent } from './components/presupuesto-obra/presupuesto-obra.component';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [PresupuestosComponent, PresupuestoObraComponent],
  imports: [
    CommonModule,
    PresupuestosRoutingModule,
    SharedModule,
    CdkMaterialModule,
    MaterialModule
  ]
})
export class PresupuestosModule { }
