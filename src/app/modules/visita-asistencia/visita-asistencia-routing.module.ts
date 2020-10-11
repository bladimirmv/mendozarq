import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitaAsistenciaComponent } from './visita-asistencia.component';

const routes: Routes = [{ path: '', component: VisitaAsistenciaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitaAsistenciaRoutingModule { }
