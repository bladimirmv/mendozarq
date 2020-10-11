import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionParticipanteRoutingModule } from './observacion-participante-routing.module';
import { ObservacionParticipanteComponent } from './observacion-participante.component';


@NgModule({
  declarations: [ObservacionParticipanteComponent],
  imports: [
    CommonModule,
    ObservacionParticipanteRoutingModule
  ]
})
export class ObservacionParticipanteModule { }
