import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRecursoRoutingModule } from './categoria-recurso-routing.module';
import { CategoriaRecursoComponent } from './categoria-recurso.component';
import { NewCategoriaRecursoComponent } from './components/new-categoria-recurso/new-categoria-recurso.component';
import { EditCategoriaRecursoComponent } from './components/edit-categoria-recurso/edit-categoria-recurso.component';


@NgModule({
  declarations: [CategoriaRecursoComponent, NewCategoriaRecursoComponent, EditCategoriaRecursoComponent],
  imports: [
    CommonModule,
    CategoriaRecursoRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CategoriaRecursoModule { }
