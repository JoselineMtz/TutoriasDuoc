import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; // Asegúrate de importar estos tipos

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']); // Crear un espía para el Router

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy } // Proporcionar el espía del Router
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router); // Inyectar el Router para verificar redirecciones
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if userRole exists', () => {
    localStorage.setItem('userRole', 'alumno'); // Simular que hay un rol
    const result = authGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeTrue(); // Debe permitir la activación
  });

  it('should redirect to /home if userRole does not exist', () => {
    localStorage.removeItem('userRole'); // Simular que no hay rol
    const result = authGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeFalse(); // Debe bloquear la activación
    expect(router.navigate).toHaveBeenCalledWith(['/home']); // Verificar redirección
  });
});
