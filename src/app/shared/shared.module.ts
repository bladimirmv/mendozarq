import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { StatusCardComponent } from './components/status-card/status-card.component';



@NgModule({
  declarations: [
    ModalComponent,
    ButtonComponent,
    CardComponent,
    StatusCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ModalComponent,
    ButtonComponent,
    CardComponent,
    StatusCardComponent
  ]
})
export class SharedModule { }
