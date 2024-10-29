import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { OfertasService } from '../../services/ofertas.service'; // Importar el servicio

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  // Variables para el formulario de Crear Viaje
  partida: string = '';
  destino: string = '';
  horaSalida: string = '';
  capacidadTotal: number = 0; 
  costoPorPersona: number = 0; 
  patente: string = ''; 
  modeloAuto: string = '';

  // Variables para alternar entre las vistas
  mostrarCrearViajeForm: boolean = true;  // Vista inicial
  mostrarVerSolicitudesForm: boolean = false;

  // Lista de solicitudes de los pasajeros
  solicitudes: any[] = [];

  constructor(
    private alertController: AlertController,
    private ofertasService: OfertasService // Inyectar el servicio
  ) {}

  // Método para alternar a la vista de Crear Viaje
  mostrarCrearViaje() {
    this.mostrarCrearViajeForm = true;   // Mostrar la vista de crear viaje
    this.mostrarVerSolicitudesForm = false;  // Ocultar la vista de ver solicitudes
  }

  // Método para alternar a la vista de Ver Solicitudes
  mostrarVerSolicitudes() {
    this.mostrarCrearViajeForm = false;  // Ocultar la vista de crear viaje
    this.mostrarVerSolicitudesForm = true;  // Mostrar la vista de ver solicitudes

    // Obtener las solicitudes de los pasajeros
    this.solicitudes = this.ofertasService.obtenerSolicitudes();
  }

  // Método para programar el viaje
  async programarViaje() {
    // Validaciones
    if (!this.partida || !this.destino || !this.horaSalida || this.capacidadTotal <= 0 || this.costoPorPersona <= 0 || !this.patente || !this.modeloAuto) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Crear la oferta
    const nuevaOferta = {
      partida: this.partida,
      destino: this.destino,
      horaSalida: this.horaSalida,
      capacidadTotal: this.capacidadTotal,
      costoPorPersona: this.costoPorPersona,
      patente: this.patente,
      modeloAuto: this.modeloAuto,
      asientosOcupados: 0
    };

    this.ofertasService.agregarOferta(nuevaOferta);

    // Mostrar mensaje de confirmación
    const alert = await this.alertController.create({
      header: 'Oferta Creada',
      message: 'Se ha creado la oferta con éxito.',
      buttons: ['OK']
    });
    await alert.present();

    // Limpiar los campos
    this.partida = '';
    this.destino = '';
    this.horaSalida = '';
    this.capacidadTotal = 0;
    this.costoPorPersona = 0;
    this.patente = '';
    this.modeloAuto = '';
  }
}
