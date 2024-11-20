import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tutor-menu',
  templateUrl: 'tutor-menu.page.html',
  styleUrls: ['tutor-menu.page.scss'],
})
export class TutorMenuPage {

  constructor(
    private router: Router,
    public toastController: ToastController
  ) {}

  async cerrarSesion() {
    // Aquí puedes agregar la lógica para cerrar sesión, si es necesario.
    // Por ejemplo, limpiar el almacenamiento local o hacer una solicitud a un servidor.

    localStorage.removeItem('userRole'); // Elimina el rol del almacenamiento local.

    // Muestra un mensaje de éxito
    const toast = await this.toastController.create({
      message: 'Sesión cerrada correctamente.',
      duration: 2000
    });
    toast.present();

    // Redirige a la página de selección de roles
    this.router.navigate(['seleccion-rol']);
  }
}
