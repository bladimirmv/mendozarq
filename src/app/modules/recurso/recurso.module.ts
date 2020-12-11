import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { RecursoRoutingModule } from './recurso-routing.module';
import { RecursoComponent } from './recurso.component';
import { NewRecursoComponent } from './components/new-recurso/new-recurso.component';
import { EditRecursoComponent } from './components/edit-recurso/edit-recurso.component';


@NgModule({
  declarations: [RecursoComponent, NewRecursoComponent, EditRecursoComponent],
  imports: [
    CommonModule,
    RecursoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RecursoModule { }
