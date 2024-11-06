<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
>>>>>>> main

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
<<<<<<< HEAD
export class HistorialPage {
  selectedRole: string | null = null;
  viajesConductor: any[] = [];
  viajesPasajero: any[] = [];

  constructor() {}


  ngOnInit() {
    this.generarHistorialConductor();
    this.generarHistorialPasajero();
  }

  generarHistorialConductor() {
    this.viajesConductor = [
      {
        fecha: '2024-09-22',
        origen: 'Duoc UC',
        destino: 'Hualpen',
        ganancias: 9000,
      },
      {
        fecha: '2024-09-23',
        origen: 'Concepcion',
        destino: 'Duoc UC',
        ganancias: 7000,
      },
      {
        fecha: '2024-09-20',
        origen: 'Talcahuano',
        destino: 'Duoc UC',
        ganancias: 5000,
      },
     
    ];
  }

  generarHistorialPasajero() {
    this.viajesPasajero = [
      {
        fecha: '2024-09-21',
        origen: 'Duoc UC',
        destino: 'Hualpen',
        costo: 3000,
      },
      {
        fecha: '2024-09-22',
        origen: 'Hualqui',
        destino: 'Duoc UC',
        costo: 2500,
      },
      {
        fecha: '2024-09-22',
        origen: 'Talcahuano',
        destino: 'Terminal de Buses',
        costo: 2500,
      },
     
    ];
=======
export class HistorialPage implements OnInit {
  selectedRole: string | null = null;
  viajesConductor: any[] = [];
  viajesPasajero: any[] = [];
  userId: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      this.userId = currentUser.uid;
      this.cargarHistorial();
    }
>>>>>>> main
  }

  verHistorial(role: string) {
    this.selectedRole = role;
<<<<<<< HEAD
=======
    if (role === 'conductor') {
      this.cargarHistorialConductor();
    } else if (role === 'pasajero') {
      this.cargarHistorialPasajero();
    }
  }

  cargarHistorial() {
    this.cargarHistorialConductor();
    this.cargarHistorialPasajero();
  }

  cargarHistorialConductor() {
    this.firestore.collection('historial', ref => ref.where('conductorId', '==', this.userId))
      .valueChanges()
      .subscribe((viajes: any[]) => {
        this.viajesConductor = viajes.map(viaje => ({
          fecha: viaje.fecha,
          origen: viaje.direccionPartida?.place_name || 'N/A',
          destino: viaje.direccionDestino?.place_name || 'N/A',
          ganancias: viaje.costo
        }));
        console.log('Historial de conductor cargado:', this.viajesConductor); // Agrega este log para verificar los datos
      });
  }

  cargarHistorialPasajero() {
    this.firestore.collection('historial', ref => ref.where('pasajeroId', '==', this.userId))
      .valueChanges()
      .subscribe((viajes: any[]) => {
        this.viajesPasajero = viajes.map(viaje => ({
          fecha: viaje.fecha,
          origen: viaje.direccionPartida?.place_name || 'N/A',
          destino: viaje.direccionDestino?.place_name || 'N/A',
          costo: viaje.costo
        }));
        console.log('Historial de pasajero cargado:', this.viajesPasajero); // Agrega este log para verificar los datos
      });
  }

  async limpiarHistorialConductor() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas limpiar todo el historial de conductor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Limpiar',
          handler: () => {
            this.firestore.collection('historial', ref => ref.where('conductorId', '==', this.userId))
              .get().subscribe(snapshot => {
                const batch = this.firestore.firestore.batch();
                snapshot.forEach(doc => {
                  batch.delete(doc.ref);
                });
                batch.commit().then(() => {
                  this.viajesConductor = [];
                });
              });
          }
        }
      ]
    });
    await alert.present();
  }

  async limpiarHistorialPasajero() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas limpiar todo el historial de pasajero?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Limpiar',
          handler: () => {
            this.firestore.collection('historial', ref => ref.where('pasajeroId', '==', this.userId))
              .get().subscribe(snapshot => {
                const batch = this.firestore.firestore.batch();
                snapshot.forEach(doc => {
                  batch.delete(doc.ref);
                });
                batch.commit().then(() => {
                  this.viajesPasajero = [];
                });
              });
          }
        }
      ]
    });
    await alert.present();
>>>>>>> main
  }
}
