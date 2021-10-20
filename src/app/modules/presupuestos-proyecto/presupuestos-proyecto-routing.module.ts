import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresupuestosProyectoComponent } from './presupuestos-proyecto.component';

const routes: Routes = [{ path: '', component: PresupuestosProyectoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresupuestosProyectoRoutingModule { }
