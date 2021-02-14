import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarpetaProyectoComponent } from './components/carpeta-proyecto/carpeta-proyecto.component';

import { DocumentosComponent } from './documentos.component';

const routes: Routes = [
  { path: '', component: DocumentosComponent },
  { path: 'carpeta/:uuid', component: CarpetaProyectoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosRoutingModule { }
