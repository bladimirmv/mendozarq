import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto.component';
import { NewProductoComponent } from './components/new-producto/new-producto.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProductoComponent } from './components/edit-producto/edit-producto.component';
import { DocumentosModule } from '../documentos/documentos.module';
import { CdkMaterialModule } from '@app/cdk-material.module';


@NgModule({
  declarations: [ProductoComponent, NewProductoComponent, EditProductoComponent],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentosModule,
    CdkMaterialModule
  ]
})
export class ProductoModule { }
