import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresupuestoObraComponent } from './components/presupuesto-obra/presupuesto-obra.component';

import { PresupuestosComponent } from './presupuestos.component';

const routes: Routes = [
  { path: '', component: PresupuestosComponent },
  { path: 'presupuesto/:uuid', component: PresupuestoObraComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresupuestosRoutingModule { }
