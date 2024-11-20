import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-menu-page',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
})
export class MenuPage {
  constructor(
    private router: Router,
    public toastController: ToastController
  ) {}

  async cerrarSesion() {
    // Elimina los datos de autenticación del almacenamiento local
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData'); // Si hay más datos del usuario que quieras eliminar

    // Muestra un mensaje de confirmación
    const toast = await this.toastController.create({
      message: 'Sesión cerrada con éxito.',
      duration: 2000
    });
    toast.present();

    // Redirige a la página de selección de roles
    this.router.navigate(['seleccion-rol']);
  }
}
