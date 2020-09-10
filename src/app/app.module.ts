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

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TitlebarComponent } from './core/titlebar/titlebar.component';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    AppContainerComponent,
    FooterComponent,
    TitlebarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MaterialModule,
    NgxElectronModule
  ],
  providers: [
    {
      provide: BUCKET,
      useValue: 'gs://mendozarq-bb534.appspot.com'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
