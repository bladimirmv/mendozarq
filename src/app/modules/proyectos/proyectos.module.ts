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
import { ClienteModalComponent } from './components/cliente-modal/cliente-modal.component';
import { DescripcionProyectoComponent } from './components/descripcion-proyecto/descripcion-proyecto.component';
import { CountProyectoPipe } from './pipes/count-proyecto.pipe';
import { MapProyectoComponent } from './components/map-proyecto/map-proyecto.component';

@NgModule({
  declarations: [
    ProyectosComponent,
    EditProyectoComponent,
    NewProyectoComponent,
    GetCategoriesPipe,
    ClienteModalComponent,
    DescripcionProyectoComponent,
    CountProyectoPipe,
    MapProyectoComponent,
  ],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ClienteModalComponent],
})
export class ProyectosModule {}
