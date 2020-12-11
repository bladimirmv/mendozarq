import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto.component';
import { NewProductoComponent } from './components/new-producto/new-producto.component';


@NgModule({
  declarations: [ProductoComponent, NewProductoComponent],
  imports: [
    CommonModule,
    ProductoRoutingModule
  ]
})
export class ProductoModule { }
