import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  partida: [number, number] = [0, 0]; // Coordenadas de partida
  destino: [number, number] = [0, 0]; // Coordenadas de destino
  map: mapboxgl.Map | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.partida = JSON.parse(params['partida']);
      this.destino = JSON.parse(params['destino']);
      
      if (Array.isArray(this.partida) && Array.isArray(this.destino)) {
        this.initializeMap();
      } else {
        console.error('Formato incorrecto de coordenadas:', this.partida, this.destino);
      }
    });
  }

  initializeMap() {
    (mapboxgl as any).accessToken = 'TU_MAPBOX_ACCESS_TOKEN';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.partida,
      zoom: 12,
    });

    // Marcadores para partida y destino
    new mapboxgl.Marker({ color: 'green' })
      .setLngLat(this.partida)
      .addTo(this.map);

    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(this.destino)
      .addTo(this.map);

    this.map.fitBounds([this.partida, this.destino], { padding: 50 });
  }
}
