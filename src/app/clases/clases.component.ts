import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Asegúrate de que este servicio está exportado correctamente
import { ClasesService } from '../services/mis-clases.service';  // Asegúrate de que este servicio está exportado correctamente
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clases', // Este es el selector del componente
  templateUrl: './clases.component.html', // Asegúrate de que la ruta del archivo HTML es correcta
  styleUrls: ['./clases.component.scss'], // Asegúrate de que la ruta del archivo de estilos es correcta
})
export class ClasesComponent implements OnInit, OnDestroy {
  roles: string[] = [];
  vistaActual: 'alumno' | 'tutor' | null = null;
  clasesPorTomar: any[] = [];
  clasesPorDar: any[] = [];
  usuarioSubscription: Subscription | null = null;
  clasesSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private clasesService: ClasesService,
    private router: Router,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef  // Inyectamos ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Se suscribe al cambio del usuario y actualiza la vista
    this.usuarioSubscription = this.authService.userChanged.subscribe(() => {
      this.obtenerUsuarioYActualizarVista();
    });

    // Obtiene el usuario actual y actualiza la vista
    this.obtenerUsuarioYActualizarVista();

    // Se suscribe al flujo de clases y actualiza la vista
    this.clasesSubscription = this.clasesService.clases$.subscribe((clases) => {
      this.actualizarClasesVista(clases);
      this.cdr.detectChanges();  // Forzamos la detección de cambios
    });
  }

  ngOnDestroy() {
    // Desuscribe las suscripciones al destruir el componente
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
    if (this.clasesSubscription) {
      this.clasesSubscription.unsubscribe();
    }
  }

  async obtenerUsuarioYActualizarVista() {
    try {
      // Obtiene el usuario actual de la autenticación
      const usuarioActual = await this.authService.getUsuarioActual();
      if (usuarioActual && usuarioActual.username) {
        this.actualizarVistaUsuario(usuarioActual.username);
      } else {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      this.router.navigate(['/home']);
    }
  }

  actualizarVistaUsuario(username: string) {
    this.roles = this.obtenerRolesUsuario();
    this.vistaActual = this.roles.includes('alumno') ? 'alumno' : (this.roles.includes('tutor') ? 'tutor' : null);
  
    // Cargar clases dependiendo de los roles
    if (this.roles.includes('alumno') || this.roles.includes('tutor')) {
      this.clasesService.cargarClases();
    }
  }
  

  obtenerRolesUsuario(): string[] {
    // Obtiene los roles del usuario
    const userRoles = this.authService.getUserRole();
    return userRoles
      ? Array.isArray(userRoles)
        ? userRoles
        : userRoles.split(',').map((role) => role.trim())
      : [];
  }
  actualizarClasesVista(clases: any[]) {
    this.authService.getUsuarioActual().then(usuarioActual => {
      if (usuarioActual && usuarioActual.username) {
        // Si el usuario es 'alumno', mostramos las clases "por tomar"
        if (this.roles.includes('alumno')) {
          this.clasesPorTomar = clases.filter(clase => clase.tipo === 'por tomar' && clase.alumnoId === usuarioActual.username);
        }
  
        // Si el usuario es 'tutor', mostramos las clases "por dar"
        if (this.roles.includes('tutor')) {
          this.clasesPorDar = clases.filter(clase => clase.tipo === 'por dar' && clase.tutorId === usuarioActual.username);
        }
      }
    }).catch(error => {
      console.error('Error al obtener el usuario actual:', error);
    });
  }
  agregarClase(nuevaClase: any) {
    // Agrega una nueva clase usando el servicio
    this.clasesService.agregarClase(nuevaClase);
    this.mostrarToast('Clases agregada correctamente');
  }

  onSegmentChange(event: any) {
    // Cambia la vista según el rol seleccionado
    const rolSeleccionado = event.detail.value;

    if (rolSeleccionado === 'alumno' && this.vistaActual !== 'alumno') {
      this.vistaActual = 'alumno';
      this.obtenerUsuarioYActualizarVista();
    } else if (rolSeleccionado === 'tutor' && this.vistaActual !== 'tutor') {
      this.vistaActual = 'tutor';
      this.obtenerUsuarioYActualizarVista();
    }
  }

  async mostrarToast(mensaje: string) {
    // Muestra un mensaje de toast
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
