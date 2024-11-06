import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { ViajeService } from '../../services/viaje.service';
import { Geolocation } from '@capacitor/geolocation'; 
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  map!: mapboxgl.Map;
  partida: [number, number] = [-74.006, 40.7128]; // Coordenadas de partida (ejemplo)
  destinoCoord: [number, number] = [-73.935242, 40.73061]; // Coordenadas de destino (ejemplo)
  pasajeros: any[] = [];
  marcadorConductor!: mapboxgl.Marker;
  userId: string | null = null;

  constructor(
    private viajeService: ViajeService,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      this.userId = currentUser.uid;
      this.inicializarMapa();
      this.obtenerPasajeros();
      this.trackRealTimeLocation();
    }
  }

  inicializarMapa() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map', // Asegúrate que este ID sea único para cada mapa
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: this.partida,
      zoom: 12,
    });

    this.map.on('load', () => {
      this.marcadorConductor = this.agregarMarcador(this.partida, 'Conductor');
      this.agregarMarcador(this.destinoCoord, 'Destino');
      this.dibujarRuta();
    });
  }

  agregarMarcador(coordenadas: [number, number], titulo: string): mapboxgl.Marker {
    return new mapboxgl.Marker()
      .setLngLat(coordenadas)
      .setPopup(new mapboxgl.Popup().setText(titulo))
      .addTo(this.map);
  }

  obtenerPasajeros() {
    if (this.userId) {
      this.viajeService.obtenerPasajerosEnTiempoReal(this.userId).subscribe((pasajeros: any[]) => {
        this.pasajeros = pasajeros;
      });
    }
  }

  actualizarLista() {
    this.obtenerPasajeros(); // Refresca la lista de pasajeros
  }

  dibujarRuta() {
    const ruta: GeoJSON.Feature<GeoJSON.Geometry> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [this.partida, this.destinoCoord],
      },
    };

    if (this.map.getSource('route')) {
      (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(ruta as any);
    } else {
      this.map.addSource('route', {
        type: 'geojson',
        data: ruta,
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#007aff',
          'line-width': 4,
        },
      });
    }
  }

  async trackRealTimeLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.updateConductorLocation(position.coords.latitude, position.coords.longitude);

    Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        this.updateConductorLocation(position.coords.latitude, position.coords.longitude);
      }
    });
  }

  updateConductorLocation(lat: number, lng: number) {
    const nuevaUbicacion: [number, number] = [lng, lat];

    if (this.marcadorConductor) {
      this.marcadorConductor.setLngLat(nuevaUbicacion);
    } else {
      this.marcadorConductor = this.agregarMarcador(nuevaUbicacion, 'Conductor');
    }

    this.map.setCenter(nuevaUbicacion);
  }

  async aceptarPasajero(pasajero: any) {
    try {
      // Crear un objeto pedido con los datos necesarios
      const pedido = {
        ...pasajero,
        conductorId: this.userId, // Asegúrate de que este ID esté presente
        estado: 'aceptado',
        fecha: new Date(), // Guarda la fecha del viaje
        direccionPartida: {
          lat: this.partida[1],
          lng: this.partida[0],
          place_name: 'Partida' // Nombre para mostrar
        },
        direccionDestino: {
          lat: this.destinoCoord[1],
          lng: this.destinoCoord[0],
          place_name: 'Destino' // Nombre para mostrar
        },
        costo: pasajero.costo // Asegúrate de incluir el costo
      };
  
      console.log('Datos del pedido:', pedido); // Agrega un log para verificar el objeto

      const batch = this.firestore.firestore.batch();
      const historialRef = this.firestore.collection('historial').doc().ref; // Crea un nuevo documento

      // Agregar el pedido a la colección de historial
      batch.set(historialRef, pedido);
  
      // Eliminar la solicitud del pasajero de la lista
      const solicitudRef = this.firestore.collection('historial').doc(pasajero.id).ref;
      batch.delete(solicitudRef);
  
      await batch.commit();
  
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'El pasajero ha sido aceptado y registrado en el historial.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error al aceptar el pasajero:', error);
    }
  }
  
  async rechazarPasajero(pasajero: any) {
    try {
      // Eliminar la solicitud del pasajero rechazado
      await this.firestore.collection('historial').doc(pasajero.id).delete();
      console.log('Solicitud eliminada:', pasajero.id);

      const alert = await this.alertController.create({
        header: 'Rechazado',
        message: 'El pasajero ha sido rechazado y su solicitud eliminada.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error al rechazar el pasajero y eliminar su solicitud:', error);
    }
  }
}
