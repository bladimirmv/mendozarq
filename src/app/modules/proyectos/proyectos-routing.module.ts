import { ProyectoComponent } from './../admin/components/proyecto/proyecto.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProyectoComponent } from './components/edit-proyecto/edit-proyecto.component';

import { ProyectosComponent } from './proyectos.component';

const routes: Routes = [
  {
    path: '', component: ProyectosComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }
