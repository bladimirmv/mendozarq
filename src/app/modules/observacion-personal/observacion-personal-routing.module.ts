import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservacionPersonalComponent } from './observacion-personal.component';

const routes: Routes = [{ path: '', component: ObservacionPersonalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservacionPersonalRoutingModule { }
