import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProyectoComponent } from './components/edit-proyecto/edit-proyecto.component';
import { NewProyectoComponent } from './components/new-proyecto/new-proyecto.component';
import { GetCategoriesPipe } from './pipes/get-categories.pipe';


@NgModule({
  declarations: [ProyectosComponent, EditProyectoComponent, NewProyectoComponent, GetCategoriesPipe],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProyectosModule { }
