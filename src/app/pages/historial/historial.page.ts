import { Component } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
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
  }

  verHistorial(role: string) {
    this.selectedRole = role;
  }
}
