import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpinionProductoRoutingModule } from './opinion-producto-routing.module';
import { OpinionProductoComponent } from './opinion-producto.component';
import { EditOpinionComponent } from './components/edit-opinion/edit-opinion.component';

@NgModule({
  declarations: [OpinionProductoComponent, EditOpinionComponent],
  imports: [
    CommonModule,
    OpinionProductoRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OpinionProductoModule {}
