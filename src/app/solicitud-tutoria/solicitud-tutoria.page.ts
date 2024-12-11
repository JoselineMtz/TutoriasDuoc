import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

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
  solicitanteNombre: string = ''; 
  solicitanteId: string = ''; // Nueva variable para almacenar el ID del solicitante

  private apiUrl = 'https://d48f8fdf-90f9-4490-8e8b-046ec5c9049c-00-2x3694wobvgbu.kirk.replit.dev';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.userChanged.subscribe(() => {
      this.resetForm();
      this.ngOnInit();
    });
  }

  async ngOnInit() {
    this.resetForm();

    try {
      const usuario = await this.authService.getUserDetails();
      if (usuario) {
        this.solicitanteNombre = usuario.fullName || usuario.username; 
        this.solicitanteId = usuario.username; // Asegura que se use el ID correcto del usuario autenticado
        console.log('Solicitante:', { nombre: this.solicitanteNombre, id: this.solicitanteId });
      } else {
        throw new Error('No se pudo obtener el usuario autenticado.');
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      await this.presentAlert('Error', 'No se pudo obtener la información del usuario.');
      this.router.navigate(['/home']);
    }
  }

  resetForm() {
    this.asignaturaSeleccionada = '';
    this.franjaHorariaSeleccionada = '';
    this.mensajeInteres = '';
    this.solicitanteNombre = '';
    this.solicitanteId = '';
  }

  async solicitarTutoria() {
    const userRole = this.authService.getUserRole();
    console.log('Rol del usuario:', userRole);

    if (!userRole || !(userRole.includes('alumno') || userRole.includes('tutor'))) {
      await this.presentAlert(
        'Error',
        'Solo los usuarios con rol de alumno o tutor pueden realizar solicitudes de tutoría.'
      );
      return;
    }

    if (!this.asignaturaSeleccionada || !this.franjaHorariaSeleccionada || !this.mensajeInteres) {
      await this.presentAlert('Error', 'Por favor, completa todos los campos antes de enviar la solicitud.');
      return;
    }

    if (!this.solicitanteId || !this.solicitanteNombre) {
      await this.presentAlert('Error', 'No se pudo cargar la información del usuario. Por favor, intenta nuevamente.');
      return;
    }

    const solicitud: Solicitud = {
      asignatura: this.asignaturaSeleccionada,
      franjaHoraria: this.franjaHorariaSeleccionada,
      mensajeInteres: this.mensajeInteres,
      solicitanteId: this.solicitanteId, // Aseguramos el ID correcto del solicitante
      solicitanteNombre: this.solicitanteNombre, 
      estado: 'pendiente',
    };

    console.log('Solicitud de tutoría:', solicitud);

    this.http.post(`${this.apiUrl}/solicitudes`, solicitud)
      .subscribe({
        next: async (response: any) => {
          console.log('Respuesta del servidor:', response);
          await this.presentAlert('Éxito', 'Tu solicitud de tutoría ha sido enviada con éxito.');
          this.router.navigate(['/user-dashboard']);
        },
        error: async (error: any) => {
          console.error('Error al enviar la solicitud:', error);
          await this.presentAlert('Error', 'Hubo un problema al enviar la solicitud.');
        },
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
