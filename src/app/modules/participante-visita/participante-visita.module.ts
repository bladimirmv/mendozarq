import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipanteVisitaRoutingModule } from './participante-visita-routing.module';
import { ParticipanteVisitaComponent } from './participante-visita.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewUsuarioVisitaComponent } from './components/new-usuario-visita/new-usuario-visita.component';


@NgModule({
  declarations: [ParticipanteVisitaComponent, NewUsuarioVisitaComponent],
  imports: [
    CommonModule,
    ParticipanteVisitaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ParticipanteVisitaModule { }
