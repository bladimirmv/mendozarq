import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservacionParticipanteComponent } from './observacion-participante.component';

const routes: Routes = [{ path: '', component: ObservacionParticipanteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservacionParticipanteRoutingModule { }
