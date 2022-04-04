import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionObraRoutingModule } from './observacion-obra-routing.module';
import { ObservacionObraComponent } from './observacion-obra.component';
import { NewObservacionObraComponent } from './components/new-observacion-obra/new-observacion-obra.component';
import { EditObservacionObraComponent } from './components/edit-observacion-obra/edit-observacion-obra.component';

@NgModule({
  declarations: [ObservacionObraComponent, NewObservacionObraComponent, EditObservacionObraComponent],
  imports: [
    CommonModule,
    ObservacionObraRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ObservacionObraModule {}
