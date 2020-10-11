import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservacionServicioComponent } from './observacion-servicio.component';

const routes: Routes = [{ path: '', component: ObservacionServicioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservacionServicioRoutingModule { }
