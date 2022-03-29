import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpinionProductoRoutingModule } from './opinion-producto-routing.module';
import { OpinionProductoComponent } from './opinion-producto.component';

@NgModule({
  declarations: [OpinionProductoComponent],
  imports: [
    CommonModule,
    OpinionProductoRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
  ],
})
export class OpinionProductoModule {}
