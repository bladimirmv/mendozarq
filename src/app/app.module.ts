import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ==========> libraries imports
import { NgxElectronModule } from 'ngx-electron';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './core/toolbar/toolbar.component';
import { AppContainerComponent } from './core/app-container/app-container.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { PersonalModule } from './modules/personal/personal.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginComponent } from './core/auth/login/login.component';
import { TitlebarComponent } from './core/titlebar/titlebar.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { FooterComponent } from './core/footer/footer.component';
import { AdminInterceptor } from './core/interceptors/admin.interceptor';



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
    HttpClientModule,
  ],
  providers: [

    { provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
