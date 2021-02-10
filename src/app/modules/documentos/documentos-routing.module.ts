import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewDocumentoComponent } from './components/new-documento/new-documento.component';

import { DocumentosComponent } from './documentos.component';

const routes: Routes = [
  { path: '', component: DocumentosComponent },
  // { path: 'upload', component: NewDocumentoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosRoutingModule { }
