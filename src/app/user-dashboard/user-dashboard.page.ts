import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
})
export class UserDashboardPage implements OnInit, ViewWillEnter {
  solicitudes: any[] = [];
  tutorias: any[] = [];
  roles: string[] = [];
  usuario: any = null;
  vistaActual: string = '';
  clases: any[] = []; // Aquí se almacenarán las clases por dar y por tomar

  // Definir la URL base de la API
  private apiUrl = 'https://d48f8fdf-90f9-4490-8e8b-046ec5c9049c-00-2x3694wobvgbu.kirk.replit.dev';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.obtenerUsuario();
  }

  ionViewWillEnter() {
    this.obtenerUsuario();
    this.cargarDatosSegunRoles();
  }

  obtenerUsuario() {
    const userRoles = this.authService.getUserRole();
    if (userRoles) {
      this.roles = Array.isArray(userRoles) ? userRoles : userRoles.split(',').map(role => role.trim());
      this.vistaActual = this.roles[0]; // Asigna el primer rol como la vista actual
    } else {
      this.router.navigate(['/home']);
    }
    this.cargarDatosSegunRoles();
  }

  cargarDatosSegunRoles() {
    if (this.roles.includes('alumno') && !this.roles.includes('tutor')) {
      this.vistaActual = 'alumno'; // Si solo tiene rol de alumno, redirige a la vista correspondiente
      this.cargarTutorias();
      this.solicitudes = [];
    } else if (this.roles.includes('tutor') && !this.roles.includes('alumno')) {
      this.vistaActual = 'tutor'; // Si solo tiene rol de tutor, redirige a la vista correspondiente
      this.cargarSolicitudes();
      this.tutorias = [];
    } else if (this.roles.includes('alumno') && this.roles.includes('tutor')) {
      if (this.vistaActual === 'alumno') {
        this.cargarTutorias();
        this.solicitudes = [];
      } else {
        this.cargarSolicitudes();
        this.tutorias = [];
      }
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }

  cargarSolicitudes() {
    this.http.get<any[]>(`${this.apiUrl}/solicitudes`).subscribe({
      next: (data) => {
        this.solicitudes = data.filter(s => s.estado === 'pendiente');
      },
      error: () => this.mostrarToast('Error al cargar solicitudes'),
    });
  }

  cargarTutorias() {
    this.http.get<any[]>(`${this.apiUrl}/tutorias`).subscribe({
      next: (data) => {
        // Filtrar las tutorías para que no aparezcan aquellas ya aceptadas en las solicitudes
        this.tutorias = data.filter(t => t.estado === 'disponible' && !this.solicitudes.some(s => s.id === t.id && s.estado === 'aceptada'));
      },
      error: () => this.mostrarToast('Error al cargar tutorías'),
    });
  }

  onSegmentChange(event: any) {
    if (this.roles.includes('alumno') && this.roles.includes('tutor')) {
      this.vistaActual = event.detail.value; // Permitir el cambio de segmento si tiene ambos roles
    } else {
      // Si solo tiene uno de los roles, bloquear el cambio de vista
      if (this.roles.includes('alumno') && event.detail.value === 'tutor') {
        this.mostrarToast('Solo puedes acceder a la vista de tutor si tienes el rol de tutor.');
        return;
      }
      if (this.roles.includes('tutor') && event.detail.value === 'alumno') {
        this.mostrarToast('Solo puedes acceder a la vista de alumno si tienes el rol de alumno.');
        return;
      }
      this.vistaActual = this.roles[0]; // Si solo tiene un rol, mantiene la vista inicial
    }
    this.cargarDatosSegunRoles();
  }

  meInteresa(tutoria: any) {
    this.authService.getUsuarioActual().then(usuario => {
      const usuarioNombre = usuario?.fullName || 'Nombre del usuario no disponible';
      const usuarioId = usuario?.username || 'ID del usuario no disponible';
  
      const tutoriaActualizada = { ...tutoria, estado: 'interesado' };
  
      this.http.put(`${this.apiUrl}/tutorias/${tutoria.id}`, tutoriaActualizada).subscribe({
        next: () => {
          this.mostrarToast(`Te interesa la tutoría de ${tutoria.asignatura}`);
          this.cargarTutorias();
  
          const claseParaAlumno = {
            tipo: 'por tomar',
            tutor: tutoria.tutor,
            tutorId: 'Tutor ID no disponible',
            asignatura: tutoria.asignatura,
            franjaHoraria: tutoria.franjaHoraria,
            alumno: usuarioNombre,
            alumnoId: usuarioId,
          };
  
          const claseParaTutor = {
            tipo: 'por dar',
            tutor: tutoria.tutor,
            tutorId: tutoria.tutorId || 'Tutor ID no disponible',
            asignatura: tutoria.asignatura,
            franjaHoraria: tutoria.franjaHoraria,
            alumno: usuarioNombre,
            alumnoId: usuarioId,
          };
  
          this.http.post(`${this.apiUrl}/clases`, claseParaAlumno).subscribe({
            next: () => this.mostrarToast('Clase "por tomar" creada para el alumno'),
            error: () => this.mostrarToast('Error al crear la clase para el alumno'),
          });
  
          this.http.post(`${this.apiUrl}/clases`, claseParaTutor).subscribe({
            next: () => this.mostrarToast('Clase "por dar" creada para el tutor'),
            error: () => this.mostrarToast('Error al crear la clase para el tutor'),
          });
        },
        error: () => this.mostrarToast('Error al registrar el estado de la tutoría'),
      });
    }).catch(() => {
      this.mostrarToast('Error al obtener información del usuario actual');
    });
  }

  noMeInteresa(tutoria: any) {
    const tutoriaActualizada = { ...tutoria, estado: 'no interesado' };
    this.http.put(`${this.apiUrl}/tutorias/${tutoria.id}`, tutoriaActualizada).subscribe({
      next: () => {
        this.mostrarToast(`No te interesa la tutoría de ${tutoria.asignatura}`);
        this.cargarTutorias();
      },
      error: () => this.mostrarToast('Error al registrar el estado de la tutoría'),
    });
  }

  aceptarSolicitud(solicitud: any) {
    this.authService.getUsuarioActual().then(tutor => {
      const tutorNombre = tutor?.fullName || 'Nombre del tutor no disponible';
      const tutorId = tutor?.username || 'ID del tutor no disponible';
  
      const solicitudActualizada = { ...solicitud, estado: 'aceptada' };
  
      this.http.put(`${this.apiUrl}/solicitudes/${solicitud.id}`, solicitudActualizada).subscribe({
        next: () => {
          this.mostrarToast(`Solicitud aceptada para: ${solicitud.asignatura}`);
  
          const claseParaTutor = {
            tipo: 'por dar',
            tutor: tutorNombre,
            tutorId: tutorId,
            asignatura: solicitud.asignatura,
            franjaHoraria: solicitud.franjaHoraria,
            alumno: solicitud.solicitanteNombre,
            alumnoId: solicitud.solicitanteId,
          };
  
          this.http.post(`${this.apiUrl}/clases`, claseParaTutor).subscribe({
            next: () => this.mostrarToast('Clase "por dar" creada para el tutor'),
            error: () => this.mostrarToast('Error al crear la clase para el tutor'),
          });
  
          this.cargarSolicitudes();
        },
        error: () => this.mostrarToast('Error al aceptar la solicitud'),
      });
    }).catch(() => {
      this.mostrarToast('Error al obtener información del tutor actual');
    });
  }

  rechazarSolicitud(solicitud: any) {
    this.http.put(`${this.apiUrl}/solicitudes/${solicitud.id}`, { estado: 'rechazada' }).subscribe({
      next: () => {
        this.mostrarToast(`Solicitud rechazada: ${solicitud.asignatura}`);
        this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
      },
      error: () => this.mostrarToast('Error al rechazar solicitud'),
    });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
    });
    toast.present();
  }

  irASolicitudTutoria() {
    if (!this.roles.includes('alumno')) {
      this.mostrarToast('Solo los alumnos pueden crear solicitudes de tutoría.');
      return;
    }
    this.router.navigate(['/solicitud-tutoria']);
  }

  irAgregarTutoria() {
    if (!this.roles.includes('tutor')) {
      this.mostrarToast('Solo los tutores pueden agregar tutorías.');
      return;
    }
    this.router.navigate(['/agregar-tutoria']);
  }

  verificarAccesoVista(rolNecesario: string) {
    return this.roles.includes(rolNecesario);
  }
}
