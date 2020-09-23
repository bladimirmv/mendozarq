import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NewUserComponent } from './components/new-user/new-user.component';


@NgModule({
  declarations: [UsersComponent, NewUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule
  ]
})
export class UsersModule { }
