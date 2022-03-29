import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpinionProductoComponent } from './opinion-producto.component';

const routes: Routes = [{ path: '', component: OpinionProductoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpinionProductoRoutingModule { }
