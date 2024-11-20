import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../services/auth.service'; // Asegúrate de importar tu interfaz

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loginData: any = {
    usuario: '',
    password: ''
  };

  field: string = "";
  isAuthenticated: boolean = false; // Estado de autenticación

  constructor(
    public toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // Inyecta el AuthService
  ) {}

  ngOnInit() {
    // Ya no necesitas verificar la autenticación aquí
  }
  async ingresar() {
    if (this.validateModel(this.loginData)) {
      this.authService.login(this.loginData.usuario, this.loginData.password).subscribe({
        next: (response: AuthResponse) => {
          if (response.isAuthenticated) {
            this.isAuthenticated = true;
            localStorage.setItem('userRole', response.role);  // Guarda el rol en localStorage
            localStorage.setItem('username', this.loginData.usuario); // Almacena el nombre de usuario
  
            this.presentToast("Bienvenido " + this.loginData.usuario);
  
            // Redirige a la vista única de usuario
            this.router.navigate(['/user-dashboard']); // Redirige a la página del dashboard
  
          } else {
            this.presentToast("Credenciales inválidas. Intente de nuevo.");
          }
        },
        error: (err) => {
          console.error('Error durante el inicio de sesión:', err);
          this.presentToast("Error al iniciar sesión. Intente de nuevo más tarde.");
        }
      });
    } else {
      this.presentToast("Falta: " + this.field);
    }
  }
  
  

  validateModel(model: any): boolean {
    for (var [key, value] of Object.entries(model)) {
      if (value === "") {
        this.field = key;
        return false;
      }
    }
    return true;
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000
    });
    toast.present();
  }

  async olvideClave() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      inputs: [{ name: 'email', type: 'email', placeholder: 'Correo Electrónico' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: (data) => {
            if (!data.email || data.email.trim() === '') {
              this.presentToast('Por favor, ingresa un correo electrónico válido.', 3000);
              return false;
            } else {
              this.presentToast("Link de recuperación enviado a su correo");
              return true;
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
