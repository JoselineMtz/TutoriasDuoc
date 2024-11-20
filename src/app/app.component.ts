import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedSegment: string = 'alumno'; // Define el segmento por defecto

  constructor(
    private platform: Platform,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Esperar a que la animación de splash termine
      setTimeout(() => {
        this.router.navigateByUrl('/seleccion-rol');
      }, 3000); // Debe coincidir con el tiempo de duración del splash
    });
  }

  ngOnInit() {
    // Puedes usar este método para inicializar cualquier lógica adicional
  }

  // Método para cerrar sesión
  cerrarSesion() {
    console.log('Cerrando sesión');
    // Aquí puedes agregar lógica para cerrar sesión, como eliminar tokens de autenticación
    // Luego redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/home']); // Cambia '/login' a la ruta de tu página de inicio de sesión
  }
}
