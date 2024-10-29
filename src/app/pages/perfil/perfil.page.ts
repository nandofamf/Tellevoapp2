import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Usuario {
  username: string;
  email: string;

  
  telefono: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: Usuario = {
    username: '',
    email: '',
    
   
    telefono: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc<Usuario>(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    ).subscribe((data: Usuario | null | undefined) => {
      if (data) {
        this.usuario = {
          username: data.username || '',
          email: data.email || '',
          
         
          telefono: data.telefono || ''
        };
      }
    });
  }
  
  async cambiarContrasena() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva Contraseña'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.newPassword === data.confirmPassword) {
              this.afAuth.currentUser.then(user => {
                if (user) {
                  user.updatePassword(data.newPassword).then(() => {
                    console.log('Contraseña actualizada');
                  }).catch(error => {
                    console.error('Error al cambiar la contraseña:', error);
                  });
                }
              });
            } else {
              console.error('Las contraseñas no coinciden');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarPerfil() {
    const alert = await this.alertController.create({
      header: 'Guardar Cambios',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Nombre',
          value: this.usuario.username
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo',
          value: this.usuario.email
        },
        {
          name: 'telefono',
          type: 'text',
          placeholder: 'Teléfono',
          value: this.usuario.telefono
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Edición cancelada');
          }
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            this.usuario.username = data.username;
            this.usuario.email = data.email;
            this.usuario.telefono = data.telefono;
            console.log('Perfil actualizado:', this.usuario);

            const user = await this.afAuth.currentUser;
            if (user) {
              await this.firestore.collection('users').doc(user.uid).update({
                username: data.username,
                email: data.email,
                telefono: data.telefono
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  cerrarSesion() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/home']);
    });
  }
}
