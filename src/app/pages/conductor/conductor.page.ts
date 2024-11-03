import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { ViajeService } from '../../services/viaje.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  map!: mapboxgl.Map;
  asientos!: number;
  costo!: number;
  partida!: [number, number];
  destinoCoord!: [number, number];
  pasajeros: any[] = [];

  constructor(private viajeService: ViajeService, private router: Router) {}

  ngOnInit() {
    // Esperar a que el contenedor 'map' esté disponible
    setTimeout(() => {
      this.inicializarMapa();
      this.obtenerViajes();
    }, 1000);
  }

  inicializarMapa() {
    // Verificar si el contenedor existe antes de crear el mapa
    if (document.getElementById('map')) {
      (mapboxgl as any).accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map', // id del contenedor en el HTML
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.006, 40.7128], // Coordenadas iniciales (puedes cambiarlas)
        zoom: 12,
      });
    } else {
      console.error("El contenedor 'map' no fue encontrado.");
    }
  }

  crearViaje() {
    if (!this.asientos || !this.costo || !this.partida || !this.destinoCoord) {
      console.error('Complete todos los campos antes de crear un viaje.');
      return;
    }

    const viaje = {
      asientos: this.asientos,
      costo: this.costo,
      partida: this.partida,
      destino: this.destinoCoord,
      pasajeros: [],
    };

    this.viajeService.crearViaje(viaje)
      .then(() => {
        console.log('Viaje creado exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear el viaje:', error);
      });
  }

  obtenerViajes() {
    this.viajeService.obtenerViajes().subscribe((viajes: any[]) => {
      this.pasajeros = viajes.reduce((acc, viaje) => acc.concat(viaje.pasajeros), []);
    });
  }

  verHistorial() {
    this.router.navigate(['/historial']);
  }
}
