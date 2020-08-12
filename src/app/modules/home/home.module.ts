import { MaterialModule } from './../../material.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExampleModalComponent } from './components/example-modal/example-modal.component';


@NgModule({
  declarations: [HomeComponent, ExampleModalComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class HomeModule { }
