import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentaProductoComponent } from './venta-producto.component';

const routes: Routes = [{ path: '', component: VentaProductoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaProductoRoutingModule { }
