import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { StatusCardComponent } from './components/status-card/status-card.component';
import { TableComponent } from './components/table/table.component';

const SharedComponents: any[] = [
  ModalComponent,
  ButtonComponent,
  CardComponent,
  StatusCardComponent,
  TableComponent
];

@NgModule({
  declarations: [
    SharedComponents
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    SharedComponents
  ]
})
export class SharedModule { }
