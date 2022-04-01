import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursoRoutingModule } from './recurso-routing.module';
import { RecursoComponent } from './recurso.component';
import { AddRecursoComponent } from './add-recurso/add-recurso.component';
import { EditRecursoComponent } from './edit-recurso/edit-recurso.component';

@NgModule({
  declarations: [RecursoComponent, AddRecursoComponent, EditRecursoComponent],
  imports: [
    CommonModule,
    RecursoRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class RecursoModule {}
