import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionPersonalRoutingModule } from './observacion-personal-routing.module';
import { ObservacionPersonalComponent } from './observacion-personal.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewObservacionPersonalComponent } from './components/new-observacion-personal/new-observacion-personal.component';
import { EditObservacionPersonalComponent } from './components/edit-observacion-personal/edit-observacion-personal.component';


@NgModule({
  declarations: [ObservacionPersonalComponent, NewObservacionPersonalComponent, EditObservacionPersonalComponent],
  imports: [
    CommonModule,
    ObservacionPersonalRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ObservacionPersonalModule { }
