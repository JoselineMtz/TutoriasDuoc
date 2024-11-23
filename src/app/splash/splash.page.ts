import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  
  private static readonly SPLASH_SHOWN_KEY = 'splashShown';

  constructor(private router: Router) { }

  ngOnInit() {
    // Si deseas evitar borrar la clave del localStorage, comenta la siguiente línea
    // localStorage.removeItem(SplashPage.SPLASH_SHOWN_KEY); 

    // Si no necesitas usar el localStorage para manejar la página splash, puedes omitir la línea anterior.
    setTimeout(() => {
      console.log('Redirigiendo a /home'); // Mensaje de depuración en consola
      this.router.navigate(['/home']); // Redirige a la página home
    }, 3000); // Espera 3 segundos antes de redirigir
  }

}
