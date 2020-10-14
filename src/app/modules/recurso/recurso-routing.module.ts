import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecursoComponent } from './recurso.component';

const routes: Routes = [{ path: '', component: RecursoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecursoRoutingModule { }
