import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaProductoRoutingModule } from './categoria-producto-routing.module';
import { CategoriaProductoComponent } from './categoria-producto.component';
import { NewCategoriaProductoComponent } from './components/new-categoria-producto/new-categoria-producto.component';
import { EditCategoriaProductoComponent } from './components/edit-categoria-producto/edit-categoria-producto.component';


@NgModule({
  declarations: [CategoriaProductoComponent, NewCategoriaProductoComponent, EditCategoriaProductoComponent],
  imports: [
    CommonModule,
    CategoriaProductoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class CategoriaProductoModule { }
