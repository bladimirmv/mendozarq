import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipantesRoutingModule } from './participantes-routing.module';
import { ParticipantesComponent } from './participantes.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPersonalProyectoComponent } from './components/new-personal-proyecto/new-personal-proyecto.component';
import { NewUsuarioProyectoComponent } from './components/new-usuario-proyecto/new-usuario-proyecto.component';


@NgModule({
  declarations: [ParticipantesComponent, NewPersonalProyectoComponent, NewUsuarioProyectoComponent],
  imports: [
    CommonModule,
    ParticipantesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ParticipantesModule { }
