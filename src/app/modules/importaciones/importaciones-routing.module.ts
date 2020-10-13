import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportacionesComponent } from './importaciones.component';

const routes: Routes = [{ path: '', component: ImportacionesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportacionesRoutingModule { }
