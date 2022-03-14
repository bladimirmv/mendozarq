import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteMendozarqComponent } from './reporte-mendozarq.component';

const routes: Routes = [{ path: '', component: ReporteMendozarqComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteMendozarqRoutingModule { }
