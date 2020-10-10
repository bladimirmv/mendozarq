import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';

import { FormsModule } from '@angular/forms';
import { EditProyectoComponent } from './components/edit-proyecto/edit-proyecto.component';


@NgModule({
  declarations: [ProyectosComponent, EditProyectoComponent],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule
  ]
})
export class ProyectosModule { }
