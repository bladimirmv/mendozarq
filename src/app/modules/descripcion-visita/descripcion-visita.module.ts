import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DescripcionVisitaRoutingModule } from './descripcion-visita-routing.module';
import { DescripcionVisitaComponent } from './descripcion-visita.component';


@NgModule({
  declarations: [DescripcionVisitaComponent],
  imports: [
    CommonModule,
    DescripcionVisitaRoutingModule
  ]
})
export class DescripcionVisitaModule { }
