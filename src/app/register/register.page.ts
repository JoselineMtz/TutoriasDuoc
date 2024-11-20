import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  tipoRegistro: 'estudiante' | 'tutor' = 'estudiante'; // Por defecto, selecciona "estudiante"

  registroData = {
    nombre: '',
    apellidos: '',
    rut: '',
    email: '',
    telefono: '',
    password: '',
    confirmarPassword: '',
    carrera: '' // Campo adicional para estudiantes
  };

  passwordValida = true;
  contraseñasCoinciden = true;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async registrarUsuario() {
    if (!this.registroData.nombre || !this.registroData.apellidos || !this.registroData.rut || !this.registroData.email || !this.registroData.telefono || !this.registroData.password || !this.registroData.confirmarPassword || (this.tipoRegistro === 'estudiante' && !this.registroData.carrera)) {
      await this.mostrarAlerta('Error', 'Por favor, complete todos los campos.');
      return;
    }

    if (!this.validarRut(this.registroData.rut)) {
      await this.mostrarAlerta('Error', 'El RUT ingresado no es válido');
      return;
    }

    if (!this.passwordValida) {
      await this.mostrarAlerta('Error', 'La contraseña no cumple con los requisitos');
      return;
    }

    if (this.registroData.password !== this.registroData.confirmarPassword) {
      await this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Registro exitoso
    await this.mostrarAlerta('Éxito', 'Registro exitoso');
    this.navCtrl.navigateRoot('/home'); // Redirige a la página de inicio
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  validarPassword() {
    this.passwordValida = this.validarPasswordStrength(this.registroData.password);
  }

  validarConfirmarPassword() {
    this.contraseñasCoinciden = this.registroData.password === this.registroData.confirmarPassword;
  }

  validarPasswordStrength(password: string): boolean {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password);
  }

  validarRut(rut: string): boolean {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    if (rut.length < 8) return false;
    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    if (!/^[0-9]+$/.test(cuerpo)) return false;
    let suma = 0, multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    let dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvCalculado;
  }

  irInicioSesion() {
    this.navCtrl.navigateBack('/home');
  }
}
