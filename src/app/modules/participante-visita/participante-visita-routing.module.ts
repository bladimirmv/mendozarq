import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticipanteVisitaComponent } from './participante-visita.component';

const routes: Routes = [{ path: '', component: ParticipanteVisitaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipanteVisitaRoutingModule { }
