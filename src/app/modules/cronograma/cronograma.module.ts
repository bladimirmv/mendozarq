import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CronogramaRoutingModule } from './cronograma-routing.module';
import { CronogramaComponent } from './cronograma.component';

import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [CronogramaComponent],
  imports: [
    CommonModule,
    CronogramaRoutingModule,
    GoogleChartsModule.forRoot()
  ]
})
export class CronogramaModule { }
