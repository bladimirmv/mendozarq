import { LoginComponent } from './core/auth/login/login.component';
import { environment } from './../environments/environment.prod';
import { FooterComponent } from './core/footer/footer.component';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './core/toolbar/toolbar.component';
import { AppContainerComponent } from './core/app-container/app-container.component';


import { TitlebarComponent } from './core/titlebar/titlebar.component';
import { PersonalModule } from './modules/personal/personal.module';
import { RegisterComponent } from './core/auth/register/register.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    AppContainerComponent,
    FooterComponent,
    TitlebarComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxElectronModule,
    PersonalModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
