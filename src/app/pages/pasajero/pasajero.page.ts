import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {
  viajes$: Observable<any[]> = new Observable();

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.viajes$ = this.firestore.collection('viajes', ref => ref.where('estado', '==', 'pendiente')).valueChanges({ idField: 'id' });
  }

  // Método para tomar una oferta
  async tomarOferta(oferta: any) {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        // Actualizar el estado del viaje a "aceptado"
        await this.firestore.collection('viajes').doc(oferta.id).update({
          pasajeroId: user.uid,
          estado: 'aceptado'
        });

        // Asegúrate de tener las coordenadas correctas de partida y destino
        const partida = oferta.partidaCoords;  // Asegúrate de que oferta tiene las coordenadas de partida
        const destino = oferta.destinoCoords;  // Asegúrate de que oferta tiene las coordenadas de destino

        // Navegar a la página de mapa pasando las coordenadas
        this.navCtrl.navigateForward('/map', {
          queryParams: { 
            partida: JSON.stringify(partida), 
            destino: JSON.stringify(destino) 
          },
        });

        // Mostrar mensaje de confirmación
        const alert = await this.alertController.create({
          header: 'Oferta Tomada',
          message: `Has tomado la oferta de ${oferta.partida} a ${oferta.destino}.`,
          buttons: ['OK']
        });
        await alert.present();
        
      } catch (error) {
        console.error('Error al tomar la oferta:', error);
      }
    }
  }
}
