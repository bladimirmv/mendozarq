import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteMendozarqRoutingModule } from './reporte-mendozarq-routing.module';
import { ReporteMendozarqComponent } from './reporte-mendozarq.component';

@NgModule({
  declarations: [ReporteMendozarqComponent],
  imports: [CommonModule, ReporteMendozarqRoutingModule],
})
export class ReporteMendozarqModule {}
