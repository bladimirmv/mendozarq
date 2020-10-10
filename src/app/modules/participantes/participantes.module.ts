import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipantesRoutingModule } from './participantes-routing.module';
import { ParticipantesComponent } from './participantes.component';


@NgModule({
  declarations: [ParticipantesComponent],
  imports: [
    CommonModule,
    ParticipantesRoutingModule
  ]
})
export class ParticipantesModule { }
