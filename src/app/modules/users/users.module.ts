import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NewUserComponent } from './components/new-user/new-user.component';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { EditUserComponent } from './components/edit-user/edit-user.component';

@NgModule({
  declarations: [UsersComponent, NewUserComponent, EditUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
