import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PasajeroRoutingModule } from './pasajero-routing.module';
import { PasajeroPage } from './pasajero.page';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasajeroRoutingModule,
    HttpClientModule // Asegúrate de agregar HttpClientModule aquí
  ],
  declarations: [PasajeroPage]
})
export class PasajeroModule {}
