import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  constructor(private firestore: AngularFirestore) {}

  crearViaje(viaje: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('viajes').doc(id).set(viaje);
  }

  obtenerViajes(): Observable<any[]> {
    return this.firestore.collection('viajes').valueChanges();
  }

  actualizarViaje(id: string, data: any): Promise<void> {
    return this.firestore.collection('viajes').doc(id).update(data);
  }
}
