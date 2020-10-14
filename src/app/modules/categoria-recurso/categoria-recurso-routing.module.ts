import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriaRecursoComponent } from './categoria-recurso.component';

const routes: Routes = [{ path: '', component: CategoriaRecursoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRecursoRoutingModule { }
