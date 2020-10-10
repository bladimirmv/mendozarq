import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitasComponent } from './visitas.component';

const routes: Routes = [{ path: '', component: VisitasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitasRoutingModule { }
