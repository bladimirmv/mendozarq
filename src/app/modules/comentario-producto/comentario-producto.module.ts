import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComentarioProductoRoutingModule } from './comentario-producto-routing.module';
import { ComentarioProductoComponent } from './comentario-producto.component';


@NgModule({
  declarations: [ComentarioProductoComponent],
  imports: [
    CommonModule,
    ComentarioProductoRoutingModule,
  ]
})
export class ComentarioProductoModule { }
