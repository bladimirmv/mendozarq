import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HerramientaComponent } from './herramienta.component';

const routes: Routes = [{ path: '', component: HerramientaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HerramientaRoutingModule { }
