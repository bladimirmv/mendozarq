import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservaProductoRoutingModule } from './reserva-producto-routing.module';
import { ReservaProductoComponent } from './reserva-producto.component';


@NgModule({
  declarations: [ReservaProductoComponent],
  imports: [
    CommonModule,
    ReservaProductoRoutingModule
  ]
})
export class ReservaProductoModule { }
