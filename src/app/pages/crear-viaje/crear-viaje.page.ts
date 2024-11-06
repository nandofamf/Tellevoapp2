import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {
  direccionPartida: any = ''; // Inicializado y cambiado a tipo `any`
  direccionDestino: any = ''; // Inicializado y cambiado a tipo `any`
  capacidad: number = 0; // Inicializado con un valor
  costo: number = 0; // Inicializado con un valor
  patente: string = ''; // Inicializado
  modelo: string = ''; // Inicializado
  map!: mapboxgl.Map; // Usamos `!` para indicar que será asignado posteriormente

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.inicializarMapa();
  }

  inicializarMapa() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.64827, -33.45694], // Coordenadas iniciales
      zoom: 10
    });
  }

  async crearViaje() {
    try {
      // Guardar los detalles del viaje en Firebase
      await this.firestore.collection('viajes').add({
        direccionPartida: this.direccionPartida,
        direccionDestino: this.direccionDestino,
        capacidad: this.capacidad,
        costo: this.costo,
        patente: this.patente,
        modelo: this.modelo,
        timestamp: new Date()
      });

      // Mostrar el mensaje de éxito
      const alert = await this.alertController.create({
        header: 'Viaje Creado',
        message: 'Se ha creado el viaje con éxito.',
        buttons: ['OK']
      });
      await alert.present();

    } catch (error) {
      console.error("Error creando el viaje: ", error);
    }
  }

  dibujarRuta() {
    if (this.direccionPartida && this.direccionDestino) {
      const ruta = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [this.direccionPartida.lng, this.direccionPartida.lat],
            [this.direccionDestino.lng, this.direccionDestino.lat]
          ]
        },
        properties: {}
      };

      const source = this.map.getSource('route') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(ruta as any);
      }
    }
  }
}
