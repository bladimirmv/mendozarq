import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComentarioProductoComponent } from './comentario-producto.component';

const routes: Routes = [{ path: '', component: ComentarioProductoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComentarioProductoRoutingModule { }
