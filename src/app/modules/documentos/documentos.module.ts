import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosComponent } from './documentos.component';
import { NewCarpetaComponent } from './components/new-carpeta/new-carpeta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCarpetaComponent } from './components/edit-carpeta/edit-carpeta.component';
import { NewDocumentoComponent } from './components/new-documento/new-documento.component';
import { DropzoneDirective } from './components/dropzone.directive';


@NgModule({
  declarations: [DocumentosComponent, NewCarpetaComponent, EditCarpetaComponent, NewDocumentoComponent, DropzoneDirective],
  imports: [
    CommonModule,
    DocumentosRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class DocumentosModule { }
