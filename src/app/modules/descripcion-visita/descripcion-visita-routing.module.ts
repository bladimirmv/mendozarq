import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescripcionVisitaComponent } from './descripcion-visita.component';

const routes: Routes = [{ path: '', component: DescripcionVisitaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescripcionVisitaRoutingModule { }
