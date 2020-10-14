import { CdkMaterialModule } from '@app/cdk-material.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresupuestosRoutingModule } from './presupuestos-routing.module';
import { PresupuestosComponent } from './presupuestos.component';
import { PresupuestoObraComponent } from './components/presupuesto-obra/presupuesto-obra.component';


@NgModule({
  declarations: [PresupuestosComponent, PresupuestoObraComponent],
  imports: [
    CommonModule,
    PresupuestosRoutingModule,
    SharedModule,
    CdkMaterialModule
  ]
})
export class PresupuestosModule { }
