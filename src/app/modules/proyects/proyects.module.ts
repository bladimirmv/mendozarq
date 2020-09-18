import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectsRoutingModule } from './proyects-routing.module';
import { ProyectsComponent } from './proyects.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProyectsComponent],
  imports: [
    CommonModule,
    ProyectsRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule
  ]
})
export class ProyectsModule { }
