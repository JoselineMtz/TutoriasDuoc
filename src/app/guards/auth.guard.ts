import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const userRole = localStorage.getItem('userRole'); // Obtiene el rol del usuario del localStorage

    if (userRole) {
      return true; // Permite el acceso si hay un rol de usuario
    } else {
      this.router.navigate(['/home']); // Redirige a /home si no hay rol de usuario
      return false; // Bloquea el acceso
    }
  }
}
