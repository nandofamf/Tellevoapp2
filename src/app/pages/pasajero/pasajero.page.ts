import { Component, OnInit } from '@angular/core';
import { OfertasService } from '../../services/ofertas.service'; // Importar el servicio
import { AlertController } from '@ionic/angular'; // Para mostrar alertas

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {
  ofertas: any[] = [];
  pasajero: string = 'Juan Pérez'; // Puedes cambiar esto para ser dinámico

  constructor(
    private ofertasService: OfertasService,
    private alertController: AlertController // Inyectar el AlertController para mostrar mensajes
  ) {}

  ngOnInit() {
    // Obtener las ofertas cuando se carga la página
    this.ofertas = this.ofertasService.obtenerOfertas();
  }

  // Método para que el pasajero tome una oferta
  async tomarOferta(oferta: any) {
    // Eliminar la oferta y registrar la solicitud en el servicio
    this.ofertasService.tomarOferta(oferta, this.pasajero);

    // Mostrar mensaje de confirmación
    const alert = await this.alertController.create({
      header: 'Oferta Tomada',
      message: `Has tomado la oferta de ${oferta.partida} a ${oferta.destino}.`,
      buttons: ['OK']
    });

    await alert.present();

    // Actualizar la lista de ofertas después de tomar una
    this.ofertas = this.ofertasService.obtenerOfertas();
  }
}
