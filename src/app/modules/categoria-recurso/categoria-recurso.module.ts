import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRecursoRoutingModule } from './categoria-recurso-routing.module';
import { CategoriaRecursoComponent } from './categoria-recurso.component';


@NgModule({
  declarations: [CategoriaRecursoComponent],
  imports: [
    CommonModule,
    CategoriaRecursoRoutingModule
  ]
})
export class CategoriaRecursoModule { }
