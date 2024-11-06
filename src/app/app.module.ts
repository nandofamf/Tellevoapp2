import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase Imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// HTTP Client Import
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http'; // <-- Importa HttpClientModule
=======
import { HttpClientModule } from '@angular/common/http';
>>>>>>> main

// Environment
import { environment } from '../environments/environment';

// Services
<<<<<<< HEAD
import { MapsService } from './services/maps.service'; // <-- Importa el servicio MapsService
=======
import { MapsService } from './services/maps.service';

// Ionic Storage Import
import { IonicStorageModule } from '@ionic/storage-angular'; // <-- Importa IonicStorageModule
>>>>>>> main

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
<<<<<<< HEAD
    HttpClientModule // <-- Añade HttpClientModule aquí
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MapsService // <-- Proveedor del servicio MapsService
=======
    HttpClientModule,
    IonicStorageModule.forRoot() // <-- Configuración de Ionic Storage
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MapsService
>>>>>>> main
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
