import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, NavController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Feature, LineString } from 'geojson';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {
  direccionPartidaInput: string = '';
  direccionDestinoInput: string = '';
  direccionPartida: any = {};
  direccionDestino: any = {};
  capacidad: number = 0;
  costo: number = 0;
  patente: string = '';
  modelo: string = '';
  map!: mapboxgl.Map;

  lugaresPartida: any[] = [];
  lugaresDestino: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.storage.create();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.inicializarMapa();
    }, 300); // Retraso para asegurarse de que el contenedor esté completamente renderizado
  }

  inicializarMapa() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;

    const mapContainer = document.getElementById('map-crear-viaje');
    if (mapContainer) {
      this.map = new mapboxgl.Map({
        container: 'map-crear-viaje',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-70.64827, -33.45694], // Coordenadas iniciales
        zoom: 10,
      });

      this.map.on('load', () => {
        this.map.resize(); // Forzar redimensión del mapa
      });
    } else {
      console.error('Contenedor del mapa no encontrado');
    }
  }

  buscarLugar(tipo: string, event: any) {
    const query = event.target.value.trim();
    if (query.length > 0) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${environment.mapbox.accessToken}&autocomplete=true&limit=5`;
      this.http.get(url).subscribe((res: any) => {
        if (tipo === 'partida') {
          this.lugaresPartida = res.features;
        } else {
          this.lugaresDestino = res.features;
        }
      });
    } else {
      if (tipo === 'partida') {
        this.lugaresPartida = [];
      } else {
        this.lugaresDestino = [];
      }
    }
  }

  seleccionarLugar(tipo: string, lugar: any) {
    const [lng, lat] = lugar.center;
    if (tipo === 'partida') {
      this.direccionPartida = { lat, lng, place_name: lugar.place_name };
      this.direccionPartidaInput = lugar.place_name;
      this.lugaresPartida = [];
    } else {
      this.direccionDestino = { lat, lng, place_name: lugar.place_name };
      this.direccionDestinoInput = lugar.place_name;
      this.lugaresDestino = [];
    }

    this.map.flyTo({ center: [lng, lat], zoom: 14 });
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);

    if (this.direccionPartida && this.direccionDestino) {
      this.dibujarRuta();
    }
  }

  convertirMayusculas(event: any) {
    this.patente = event.target.value.toUpperCase();
  }

  async crearViaje() {
    const currentUser = await this.auth.currentUser;
    if (!currentUser) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo autenticar al usuario.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (!this.costo || !this.patente || !this.modelo) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos obligatorios.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const viaje = {
      direccionPartida: this.direccionPartida,
      direccionDestino: this.direccionDestino,
      capacidad: this.capacidad,
      costo: this.costo,
      asientosOcupados: 0,
      estado: 'pendiente',
      conductorId: currentUser.uid,
      timestamp: new Date(),
    };

    try {
      console.log('Datos del viaje:', viaje);
      await this.firestore.collection('viajes').add(viaje);

      const alert = await this.alertController.create({
        header: 'Viaje Creado',
        message: 'Se ha creado el viaje con éxito.',
        buttons: ['OK'],
      });
      await alert.present();

      // Navegar de vuelta al panel del conductor
      this.navCtrl.navigateBack('/conductor');
    } catch (error) {
      console.error('Error creando el viaje:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al crear el viaje. Intenta nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  volverAtras() {
    this.navCtrl.navigateBack('/conductor'); // Navegar a 'conductor'
  }

  dibujarRuta() {
    const ruta: Feature<LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [this.direccionPartida.lng, this.direccionPartida.lat],
          [this.direccionDestino.lng, this.direccionDestino.lat],
        ],
      },
      properties: {},
    };

    if (this.map.getSource('route')) {
      (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(ruta);
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
}
