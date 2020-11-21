import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaProyectoRoutingModule } from './categoria-proyecto-routing.module';
import { CategoriaProyectoComponent } from './categoria-proyecto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewCategoriaProyectoComponent } from './components/new-categoria-proyecto/new-categoria-proyecto.component';
import { EditCategoriaProyectoComponent } from './components/edit-categoria-proyecto/edit-categoria-proyecto.component';


@NgModule({
  declarations: [CategoriaProyectoComponent, NewCategoriaProyectoComponent, EditCategoriaProyectoComponent],
  imports: [
    CommonModule,
    CategoriaProyectoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule

  ]
})
export class CategoriaProyectoModule { }
