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
import { NewCapituloComponent } from './components/new-capitulo/new-capitulo.component';
import { NewDetalleCapituloComponent } from './components/new-detalle-capitulo/new-detalle-capitulo.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { EditCapituloComponent } from './components/edit-capitulo/edit-capitulo.component';
import { EditDetalleCapituloComponent } from './components/edit-detalle-capitulo/edit-detalle-capitulo.component';

const components: any[] = [
  PresupuestosComponent,
  PresupuestoObraComponent,
  NewPresupuestoComponent,
  EditPresupuestoComponent,
  NewCapituloComponent,
  NewDetalleCapituloComponent,
  EditCapituloComponent,
  EditDetalleCapituloComponent
];

@NgModule({
  declarations: [
    components
  ],


  imports: [
    CommonModule,
    PresupuestosRoutingModule,
    SharedModule,
    CdkMaterialModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    components
  ]
})
export class PresupuestosModule { }
