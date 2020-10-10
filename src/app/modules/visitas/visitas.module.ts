import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitasRoutingModule } from './visitas-routing.module';
import { VisitasComponent } from './visitas.component';


@NgModule({
  declarations: [VisitasComponent],
  imports: [
    CommonModule,
    VisitasRoutingModule
  ]
})
export class VisitasModule { }
