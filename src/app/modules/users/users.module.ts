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
import { UserTypePipe } from './pipes/user-type.pipe';
import { ChipColorPipe } from './pipes/chip-color.pipe';
import { ShortTextPipe } from './pipes/short-text.pipe';
import { ShowContrasenhaComponent } from './components/show-contrasenha/show-contrasenha.component';

@NgModule({
  declarations: [UsersComponent, NewUserComponent, EditUserComponent, UserTypePipe, ChipColorPipe, ShortTextPipe, ShowContrasenhaComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
// bmvmendo123
