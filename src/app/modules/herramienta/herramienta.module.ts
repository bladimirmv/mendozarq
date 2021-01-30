import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HerramientaRoutingModule } from './herramienta-routing.module';
import { HerramientaComponent } from './herramienta.component';


@NgModule({
  declarations: [HerramientaComponent],
  imports: [
    CommonModule,
    HerramientaRoutingModule
  ]
})
export class HerramientaModule { }
