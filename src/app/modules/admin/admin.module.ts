import { CdkMaterialModule } from '@app/cdk-material.module';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { LirakiComponent } from './components/liraki/liraki.component';
import { VisitaComponent } from './components/visita/visita.component';


@NgModule({
  declarations: [AdminComponent, DashboardComponent, ProyectoComponent, LirakiComponent, VisitaComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule,
    CdkMaterialModule

  ]
})
export class AdminModule { }
