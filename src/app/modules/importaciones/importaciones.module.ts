import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportacionesRoutingModule } from './importaciones-routing.module';
import { ImportacionesComponent } from './importaciones.component';


@NgModule({
  declarations: [ImportacionesComponent],
  imports: [
    CommonModule,
    ImportacionesRoutingModule
  ]
})
export class ImportacionesModule { }
