import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  nombre: string = '';
  carrera: string = '';
  jornada: string = '';
  correo: string = '';
  telefono: string = ''; // Campo de teléfono
  nombreSocial: string = ''; // Campo para el nombre social
  fotoPerfil: string | ArrayBuffer | null = null; // Imagen de perfil

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.limpiarDatosPerfil(); // Limpiar los datos anteriores
    // Cargar los datos desde el archivo bd.json
    this.http.get<{ users: any[] }>('assets/bd.json').subscribe(
      (data) => {
        const username = localStorage.getItem('username'); // Obtener el nombre de usuario
        const usuario = data.users.find(user => user.username === username);
        if (usuario) {
          this.nombre = usuario.nombre;
          this.carrera = usuario.carrera;
          this.jornada = usuario.jornada;
          this.correo = usuario.correo;
          this.telefono = usuario.telefono;
          this.nombreSocial = usuario.nombreSocial;
          this.fotoPerfil = usuario.foto || null; // Cargar foto si existe, o null si no
          localStorage.setItem('userId', usuario.id); // Guarda el ID en el localStorage
        } else {
          console.error('Usuario no encontrado');
        }
      },
      (error) => {
        console.error('Error al cargar el perfil:', error);
      }
    );
  }

  guardarPerfil() {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage
    const username = localStorage.getItem('username'); // Obtener el nombre de usuario desde el localStorage

    if (!userId) {
      console.error('ID de usuario no encontrado');
      return;
    }

    // Verificar si hay campos vacíos
    if (!this.nombre || !this.carrera || !this.jornada || !this.correo || !this.nombreSocial) {
      this.presentToast('Por favor, completa todos los campos requeridos.', 3000);
      return;
    }

    const perfil = {
      nombre: this.nombre,
      carrera: this.carrera,
      jornada: this.jornada,
      correo: this.correo,
      telefono: this.telefono,
      nombreSocial: this.nombreSocial,
      foto: this.fotoPerfil, // La foto se mantendrá como una cadena de texto (base64)
      id: userId, // Mantener el ID del usuario
      username: username,
    };

    // Hacer una solicitud PUT para actualizar los datos del perfil
    this.http.put(`http://localhost:3000/users/${userId}`, perfil).subscribe(
      (response) => {
        console.log('Perfil actualizado:', response);
        this.presentToast('Perfil actualizado con éxito.', 3000); // Mensaje de éxito
      },
      (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.presentToast('Hubo un error al actualizar el perfil.', 3000); // Mensaje de error
      }
    );
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }

  async seleccionarFoto() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        quality: 90,
      });
      if (image.dataUrl) {
        this.fotoPerfil = image.dataUrl; // Guardar la imagen en base64
      } else {
        console.error('No se pudo obtener dataUrl de la imagen');
      }
    } catch (error) {
      console.error('Error al seleccionar la foto:', error);
      alert('No se pudo seleccionar la foto. Asegúrate de que los permisos estén habilitados.');
    }
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });
      if (image.dataUrl) {
        this.fotoPerfil = image.dataUrl; // Guardar la imagen en base64
      } else {
        console.error('No se pudo obtener dataUrl de la imagen');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      alert('No se pudo tomar la foto. Asegúrate de que la cámara esté habilitada.');
    }
  }

  cerrarSesion() {
    // Limpiar el local storage y las propiedades del perfil
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.limpiarDatosPerfil(); // Limpia los datos del perfil
    this.router.navigate(['/home']);
    console.log('Sesión cerrada con éxito');
  }

  limpiarDatosPerfil() {
    // Restablecer todos los campos del perfil
    this.nombre = '';
    this.carrera = '';
    this.jornada = '';
    this.correo = '';
    this.telefono = '';
    this.nombreSocial = '';
    this.fotoPerfil = null; // Asegúrate de restablecer la foto
  }
}
