import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

// Definir la interfaz para una solicitud de tutoría
interface Solicitud {
  id?: string; 
  asignatura: string;
  franjaHoraria: string;
  mensajeInteres: string;
  solicitanteId: string;
  solicitanteNombre: string;
  estado: string;
}

@Component({
  selector: 'app-solicitud-tutoria',
  templateUrl: './solicitud-tutoria.page.html',
  styleUrls: ['./solicitud-tutoria.page.scss'],
})
export class SolicitudTutoriaPage implements OnInit {
  asignaturaSeleccionada: string = '';
  franjaHorariaSeleccionada: string = '';
  mensajeInteres: string = '';
  solicitanteNombre: string = ''; // Variable para el nombre del solicitante

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient,
    private authService: AuthService // Servicio de autenticación
  ) {
    // Suscribirse al cambio de usuario para actualizar los datos dinámicamente
    this.authService.userChanged.subscribe(() => {
      this.resetForm();
      this.ngOnInit();
    });
  }

  async ngOnInit() {
    this.resetForm(); // Restablecer las variables del formulario
    try {
      // Obtener detalles del usuario autenticado
      const usuario = await this.authService.getUserDetails();
      if (usuario) {
        this.solicitanteNombre = usuario.fullName || usuario.username; // Preferir fullName si existe
        console.log('Nombre del solicitante:', this.solicitanteNombre);
      } else {
        throw new Error('No se pudo obtener el usuario autenticado.');
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      await this.presentAlert('Error', 'No se pudo obtener el nombre del usuario.');
      this.router.navigate(['/home']);
    }
  }

  // Método para reiniciar las variables del formulario
  resetForm() {
    this.asignaturaSeleccionada = '';
    this.franjaHorariaSeleccionada = '';
    this.mensajeInteres = '';
    this.solicitanteNombre = '';
  }

  async solicitarTutoria() {
    // Obtener el rol del usuario desde AuthService
    const userRole = this.authService.getUserRole();
    console.log('Rol del usuario:', userRole);

    // Verificar si el usuario tiene un rol permitido
    if (!userRole || !(userRole.includes('alumno') || userRole.includes('tutor'))) {
      await this.presentAlert(
        'Error',
        'Solo los usuarios con rol de alumno o tutor pueden realizar solicitudes de tutoría.'
      );
      return;
    }

    // Validar que todos los campos estén completos
    if (!this.asignaturaSeleccionada || !this.franjaHorariaSeleccionada || !this.mensajeInteres) {
      await this.presentAlert('Error', 'Por favor, completa todos los campos antes de enviar la solicitud.');
      return;
    }

    if (!this.solicitanteNombre) {
      await this.presentAlert('Error', 'No se pudo cargar el nombre del solicitante. Por favor, intenta nuevamente.');
      return;
    }

    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde localStorage

    // Crear el objeto de solicitud
    const solicitud: Solicitud = {
      asignatura: this.asignaturaSeleccionada,
      franjaHoraria: this.franjaHorariaSeleccionada,
      mensajeInteres: this.mensajeInteres,
      solicitanteId: userId || '', 
      solicitanteNombre: this.solicitanteNombre, 
      estado: 'pendiente' 
    };

    console.log('Solicitud de tutoría:', solicitud);

    // Enviar la solicitud al servidor
    this.http.post('http://localhost:3000/solicitudes', solicitud)
      .subscribe({
        next: async (response: any) => {
          console.log('Respuesta del servidor:', response);
          await this.presentAlert('Éxito', 'Tu solicitud de tutoría ha sido enviada con éxito.');
          this.router.navigate(['/user-dashboard']);
        },
        error: async (error: any) => {
          console.error('Error al enviar la solicitud:', error);
          await this.presentAlert('Error', 'Hubo un problema al enviar la solicitud.');
        }
      });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
