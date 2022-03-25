import { PedidoComponent } from './components/pedido/pedido.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosComponent } from './pedidos.component';

const routes: Routes = [
  { path: '', component: PedidosComponent },
  {
    path: 'pedido/:uuid',
    component: PedidoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosRoutingModule {}
