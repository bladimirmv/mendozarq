import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitasRoutingModule } from './visitas-routing.module';
import { VisitasComponent } from './visitas.component';
import { EditVisitaComponent } from './components/edit-visita/edit-visita.component';


@NgModule({
  declarations: [VisitasComponent, EditVisitaComponent],
  imports: [
    CommonModule,
    VisitasRoutingModule,
    SharedModule
  ]
})
export class VisitasModule { }
