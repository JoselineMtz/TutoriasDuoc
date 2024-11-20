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
    if (this.vistaActual === 'alumno' && this.roles.includes('alumno')) {
      this.cargarTutorias();
      this.solicitudes = [];
    } else if (this.vistaActual === 'tutor' && this.roles.includes('tutor')) {
      this.cargarSolicitudes();
      this.tutorias = [];
    } else {
      this.router.navigate(['/no-access']);
    }
  }

  cargarSolicitudes() {
    this.http.get<any[]>('http://localhost:3000/solicitudes').subscribe({
      next: (data) => {
        this.solicitudes = data.filter(s => s.estado === 'pendiente');
      },
      error: () => this.mostrarToast('Error al cargar solicitudes'),
    });
  }

  cargarTutorias() {
    this.http.get<any[]>('http://localhost:3000/tutorias').subscribe({
      next: (data) => {
        this.tutorias = data.filter(t => t.estado === 'disponible');
      },
      error: () => this.mostrarToast('Error al cargar tutorías'),
    });
  }

  onSegmentChange(event: any) {
    this.vistaActual = event.detail.value;
    this.cargarDatosSegunRoles();
  }

  meInteresa(tutoria: any) {
    const tutoriaActualizada = { ...tutoria, estado: 'interesado' };
    this.http.put(`http://localhost:3000/tutorias/${tutoria.id}`, tutoriaActualizada).subscribe({
      next: () => {
        this.mostrarToast(`Te interesa la tutoría de ${tutoria.asignatura}`);
        this.cargarTutorias();
      },
      error: () => this.mostrarToast('Error al registrar el estado de la tutoría'),
    });
  }

  noMeInteresa(tutoria: any) {
    const tutoriaActualizada = { ...tutoria, estado: 'no interesado' };
    this.http.put(`http://localhost:3000/tutorias/${tutoria.id}`, tutoriaActualizada).subscribe({
      next: () => {
        this.mostrarToast(`No te interesa la tutoría de ${tutoria.asignatura}`);
        this.cargarTutorias();
      },
      error: () => this.mostrarToast('Error al registrar el estado de la tutoría'),
    });
  }

  actualizarEstadoTutoria(tutoria: any, estado: string, mensaje: string) {
    this.http.put(`http://localhost:3000/tutorias/${tutoria.id}`, { estado }).subscribe({
      next: () => {
        this.mostrarToast(`${mensaje} ${tutoria.asignatura}`);
        this.cargarTutorias();
      },
      error: () => this.mostrarToast('Error al actualizar el estado de la tutoría'),
    });
  }

  aceptarSolicitud(solicitud: any) {
    const solicitudActualizada = { ...solicitud, estado: 'aceptada' };
    this.http.put(`http://localhost:3000/solicitudes/${solicitud.id}`, solicitudActualizada).subscribe({
      next: () => this.crearTutoriaDesdeSolicitud(solicitud),
      error: () => this.mostrarToast('Error al aceptar solicitud'),
    });
  }

  rechazarSolicitud(solicitud: any) {
    this.http.put(`http://localhost:3000/solicitudes/${solicitud.id}`, { estado: 'rechazada' }).subscribe({
      next: () => {
        this.mostrarToast(`Solicitud rechazada: ${solicitud.asignatura}`);
        this.cargarSolicitudes();
      },
      error: () => this.mostrarToast('Error al rechazar solicitud'),
    });
  }

  crearTutoriaDesdeSolicitud(solicitud: any) {
    // Verifica que este método solo sea ejecutado por tutores
    if (!this.roles.includes('tutor')) {
      this.mostrarToast('No tienes permisos para crear una tutoría');
      return;
    }

    const nuevaTutoria = {
      id: solicitud.id,
      asignatura: solicitud.asignatura,
      franjaHoraria: solicitud.franjaHoraria,
      tutor: solicitud.solicitanteNombre,
      tutorId: solicitud.solicitanteId,
      estado: 'disponible',
    };

    this.http.post('http://localhost:3000/tutorias', nuevaTutoria).subscribe({
      next: () => {
        this.mostrarToast(`Solicitud aceptada y tutoría creada: ${solicitud.asignatura}`);
        this.cargarSolicitudes();
        this.cargarTutorias();
      },
      error: () => this.mostrarToast('Error al crear tutoría'),
    });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
    });
    await toast.present();
  }

  irASolicitudTutoria() {
    // Verifica que solo los alumnos puedan acceder
    if (!this.roles.includes('alumno')) {
      this.mostrarToast('Solo los alumnos pueden crear solicitudes de tutoría.');
      return;
    }
    this.router.navigate(['/solicitud-tutoria']);
  }

  irAgregarTutoria() {
    // Verifica que solo los tutores puedan acceder
    if (!this.roles.includes('tutor')) {
      this.mostrarToast('Solo los tutores pueden agregar tutorías.');
      return;
    }
    this.router.navigate(['/agregar-tutoria']);
  }

  verificarAccesoVista(rolNecesario: string) {
    if (!this.roles.includes(rolNecesario)) {
      this.router.navigate(['/no-access']);
      this.mostrarToast('No puedes acceder a este contenido.');
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
