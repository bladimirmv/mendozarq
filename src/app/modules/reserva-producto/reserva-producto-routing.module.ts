import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservaProductoComponent } from './reserva-producto.component';

const routes: Routes = [{ path: '', component: ReservaProductoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservaProductoRoutingModule { }
