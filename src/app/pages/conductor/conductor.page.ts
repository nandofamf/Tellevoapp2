import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { ViajeService } from '../../services/viaje.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  map!: mapboxgl.Map;
  partida: [number, number] = [-74.006, 40.7128];
  destinoCoord: [number, number] = [-73.935242, 40.73061];
  pasajeros: any[] = []; // Cambié Pasajero[] por any[]

  constructor(private viajeService: ViajeService) {}

  ngOnInit() {
    this.inicializarMapa();
    this.obtenerPasajeros();
  }

  inicializarMapa() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken; // Asignación del accessToken de Mapbox
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.partida,
      zoom: 12,
    });

    this.map.on('load', () => {
      this.agregarMarcador(this.partida, 'Partida');
      this.agregarMarcador(this.destinoCoord, 'Destino');
      this.dibujarRuta(); // Asegúrate de dibujar la ruta después de que el mapa haya cargado
    });
  }

  agregarMarcador(coordenadas: [number, number], titulo: string) {
    new mapboxgl.Marker()
      .setLngLat(coordenadas)
      .setPopup(new mapboxgl.Popup().setText(titulo))
      .addTo(this.map);
  }

  obtenerPasajeros() {
    this.viajeService.obtenerPasajeros().subscribe((pasajeros: any[]) => {
      this.pasajeros = pasajeros;
    });
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
}
