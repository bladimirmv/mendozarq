import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pedidos.component';
import { PedidoComponent } from './components/pedido/pedido.component';

@NgModule({
  declarations: [PedidosComponent, PedidoComponent],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
})
export class PedidosModule {}
