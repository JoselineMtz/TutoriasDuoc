import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss']
})
export class ClasesComponent implements OnInit {
  solicitudes: any[] = []; // Solicitudes de tutoría para el tutor
  tutorias: any[] = []; // Tutorías disponibles o aceptadas para alumno y tutor
  clasesPorDar: any[] = []; // Clases que el tutor tiene por dar
  clasesPorTomar: any[] = []; // Clases que el alumno tiene por tomar
  usuario: any = null;
  roles: string[] = [];
  vistaActual: string = ''; // Para controlar si es alumno o tutor

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.obtenerUsuario();
    this.cargarDatosSegunRol();
  }

  obtenerUsuario() {
    const userRoles = this.authService.getUserRole(); // Obtener el rol del usuario

    if (userRoles) {
      this.roles = Array.isArray(userRoles) ? userRoles : userRoles.split(',').map(role => role.trim());
      this.vistaActual = this.roles[0]; // Asignamos el rol principal
    } else {
      this.router.navigate(['/home']); // Redirigir si no hay rol
    }
    this.cargarDatosSegunRol(); // Cargar datos después de obtener el rol
  }

  cargarDatosSegunRol() {
    if (this.vistaActual === 'alumno' && this.roles.includes('alumno')) {
      this.cargarTutoriasAlumno();
      this.cargarSolicitudesAlumno();
    } 
    else if (this.vistaActual === 'tutor' && this.roles.includes('tutor')) {
      this.cargarSolicitudesTutor();
      this.cargarTutoriasTutor();
    } 
    else {
      this.router.navigate(['/no-access']);
    }
  }

  cargarTutoriasAlumno() {
    this.http.get<any[]>('http://localhost:3000/tutorias').subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos recibidos
        this.clasesPorTomar = data.filter(tutoria => tutoria.estado === 'aceptada' || tutoria.estado === 'interesado')
                                   .map(tutoria => ({
                                     ...tutoria,
                                     nombreTutor: (tutoria.nombreTutor && typeof tutoria.nombreTutor === 'string' && tutoria.nombreTutor.trim()) 
                                               ? tutoria.nombreTutor 
                                               : 'Tutor no disponible'
                                   }));
      },
      error: () => {
        console.error('Error al cargar tutorías');
      },
    });
  }

  cargarSolicitudesAlumno() {
    this.http.get<any[]>('http://localhost:3000/solicitudes').subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos recibidos
        this.clasesPorDar = data.filter(solicitud => solicitud.estado === 'aceptada')
                                 .map(solicitud => ({
                                   ...solicitud,
                                   nombreTutor: (solicitud.nombreTutor && typeof solicitud.nombreTutor === 'string' && solicitud.nombreTutor.trim()) 
                                               ? solicitud.nombreTutor 
                                               : 'Tutor no disponible'
                                 }));
      },
      error: () => {
        console.error('Error al cargar solicitudes');
      },
    });
  }

  cargarSolicitudesTutor() {
    this.http.get<any[]>('http://localhost:3000/solicitudes').subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos recibidos
        this.solicitudes = data.filter(solicitud => solicitud.estado === 'aceptada')
                               .map(solicitud => ({
                                 ...solicitud,
                                 nombreSolicitante: (solicitud.nombreSolicitante && typeof solicitud.nombreSolicitante === 'string' && solicitud.nombreSolicitante.trim()) 
                                                   ? solicitud.nombreSolicitante 
                                                   : 'Solicitante no disponible'
                               }));
      },
      error: () => {
        console.error('Error al cargar solicitudes');
      },
    });
  }

  cargarTutoriasTutor() {
    this.http.get<any[]>('http://localhost:3000/tutorias').subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos recibidos
        this.tutorias = data.filter(tutoria => tutoria.estado === 'aceptada')
                             .map(tutoria => ({
                               ...tutoria,
                               nombreSolicitante: (tutoria.nombreSolicitante && typeof tutoria.nombreSolicitante === 'string' && tutoria.nombreSolicitante.trim()) 
                                                 ? tutoria.nombreSolicitante 
                                                 : 'Solicitante no disponible'
                             }));
      },
      error: () => {
        console.error('Error al cargar tutorías');
      },
    });
  }
}
