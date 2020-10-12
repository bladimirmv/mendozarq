import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaProyectoRoutingModule } from './categoria-proyecto-routing.module';
import { CategoriaProyectoComponent } from './categoria-proyecto.component';


@NgModule({
  declarations: [CategoriaProyectoComponent],
  imports: [
    CommonModule,
    CategoriaProyectoRoutingModule
  ]
})
export class CategoriaProyectoModule { }
