import { ProyectosModule } from './../proyectos/proyectos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaProductoRoutingModule } from './venta-producto-routing.module';
import { VentaProductoComponent } from './venta-producto.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewVentaComponent } from './components/new-venta/new-venta.component';
import { EditVentaComponent } from './components/edit-venta/edit-venta.component';
import { VentasOnlineComponent } from './components/ventas-online/ventas-online.component';

@NgModule({
  declarations: [
    VentaProductoComponent,
    NewVentaComponent,
    EditVentaComponent,
    VentasOnlineComponent,
  ],
  imports: [
    CommonModule,
    VentaProductoRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosModule,
  ],
})
export class VentaProductoModule {}
