import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ProveedorComponent } from './proveedor.component';
import { AddProveedorComponent } from './components/add-proveedor/add-proveedor.component';
import { EditProveedorComponent } from './components/edit-proveedor/edit-proveedor.component';

@NgModule({
  declarations: [ProveedorComponent, AddProveedorComponent, EditProveedorComponent],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ProveedorModule {}
