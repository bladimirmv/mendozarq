import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaProductoRoutingModule } from './categoria-producto-routing.module';
import { CategoriaProductoComponent } from './categoria-producto.component';


@NgModule({
  declarations: [CategoriaProductoComponent],
  imports: [
    CommonModule,
    CategoriaProductoRoutingModule
  ]
})
export class CategoriaProductoModule { }
