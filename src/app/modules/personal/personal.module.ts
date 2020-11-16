import { MaterialModule } from './../../material.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from './personal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPersonalComponent } from './components/new-personal/new-personal.component';
import { EditPersonalComponent } from './components/edit-personal/edit-personal.component';


@NgModule({
  declarations: [PersonalComponent, NewPersonalComponent, EditPersonalComponent],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FormsModule
  ]
})
export class PersonalModule { }
