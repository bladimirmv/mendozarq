import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaProductoRoutingModule } from './venta-producto-routing.module';
import { VentaProductoComponent } from './venta-producto.component';


@NgModule({
  declarations: [VentaProductoComponent],
  imports: [
    CommonModule,
    VentaProductoRoutingModule
  ]
})
export class VentaProductoModule { }
