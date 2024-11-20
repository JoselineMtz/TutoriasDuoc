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
    localStorage.removeItem(SplashPage.SPLASH_SHOWN_KEY);
    
    setTimeout(() => {
      console.log('Redirigiendo a /home'); // Mensaje de depuración
      this.router.navigateByUrl('/home');
    }, 3000);
  }
  
}
