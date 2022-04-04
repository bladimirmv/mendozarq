import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservacionObraComponent } from './observacion-obra.component';

const routes: Routes = [{ path: '', component: ObservacionObraComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservacionObraRoutingModule { }
