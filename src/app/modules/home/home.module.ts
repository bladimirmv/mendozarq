import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExampleModalComponent } from './components/example-modal/example-modal.component';

import { NgxElectronModule } from 'ngx-electron';
@NgModule({
  declarations: [HomeComponent, ExampleModalComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule,
    NgxElectronModule
  ]
})
export class HomeModule { }
