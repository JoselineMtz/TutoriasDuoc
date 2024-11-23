import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../services/auth.service'; // Importa el AuthService

@Component({
  selector: 'app-agregar-tutoria',
  templateUrl: './agregar-tutoria.page.html',
  styleUrls: ['./agregar-tutoria.page.scss'],
})
export class AgregarTutoriaPage implements OnInit {
  tutorNombre: string = '';
  asignatura: string = '';
  franjaHoraria: string = '';
  tutorId: string = '';  // Añadido para almacenar el userId

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private authService: AuthService // Inyectamos AuthService
  ) {}

  ngOnInit() {
    this.cargarDatosTutor();
  }

  // Función para cargar los datos del tutor desde el AuthService
  async cargarDatosTutor() {
    try {
      // Llamamos al método getUserDetails() del AuthService para obtener el usuario autenticado
      const user: User | undefined = await this.authService.getUserDetails();
      if (user) {
        this.tutorNombre = user.fullName; // Asignamos el nombre completo del tutor
        this.tutorId = user.username;  // Asignamos el userId del tutor
      } else {
        console.error('Tutor no encontrado');
        await this.presentAlert('Error', 'No se encontró el tutor.');
      }
    } catch (error) {
      console.error('Error al cargar datos del tutor:', error);
      await this.presentAlert('Error', 'Hubo un problema al obtener los datos del tutor.');
    }
  }

  async agregarTutoria() {
    // Validación de los campos
    if (!this.asignatura || !this.franjaHoraria) {
      await this.presentAlert('Error', 'Por favor, completa todos los campos antes de agregar la tutoría.');
      return;
    }

    if (!this.tutorId) {
      await this.presentAlert('Error', 'No se encontró el ID del tutor.');
      return;
    }

    const nuevaTutoria = {
      tutorId: this.tutorId,  // Usamos el tutorId obtenido del AuthService
      tutor: this.tutorNombre,
      asignatura: this.asignatura,
      franjaHoraria: this.franjaHoraria,
      estado: 'disponible',
    };

    // Enviar la nueva tutoría al servidor
    this.http.post('http://localhost:3000/tutorias', nuevaTutoria).subscribe({
      next: async () => {
        await this.presentAlert('Éxito', 'La tutoría ha sido creada exitosamente.');
        this.resetFormulario();
      },
      error: async (error) => {
        console.error('Error al agregar la tutoría:', error);
        await this.presentAlert('Error', 'Hubo un problema al agregar la tutoría.');
      },
    });
  }

  resetFormulario() {
    this.asignatura = '';
    this.franjaHoraria = '';
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
