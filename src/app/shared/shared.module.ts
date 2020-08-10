import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';



@NgModule({
  declarations: [
    ModalComponent,
    ButtonComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ModalComponent,
    ButtonComponent,
    CardComponent
  ]
})
export class SharedModule { }
