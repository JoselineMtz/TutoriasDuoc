import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

// Interfaz `User`
export interface User {
  username: string;
  password: string;
  role: string;
  fullName: string;
}

// Interfaz `AuthResponse`
export interface AuthResponse {
  isAuthenticated: boolean;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private users: User[] = [];
  userChanged = new Subject<void>();

  constructor(private router: Router, private http: HttpClient) {
    this.loadUsers(); // Cargar usuarios al inicializar el servicio
  }

  // Método para cargar usuarios desde el archivo JSON
  private loadUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<{ users: User[] }>('assets/credenciales.json').subscribe(
        (data) => {
          this.users = data.users;
          resolve();
        },
        (error) => reject(error)
      );
    });
  }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      const user = this.users.find(
        (user) => user.username === username && user.password === password
      );
      if (user) {
        this.isAuthenticated = true;
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('username', user.username);
        this.userChanged.next();
        observer.next({ isAuthenticated: true, role: user.role });
      } else {
        observer.next({ isAuthenticated: false, role: '' });
      }
      observer.complete();
    });
  }

  // Método para cerrar sesión
  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    this.userChanged.next();
    this.router.navigate(['/home']);
    window.location.reload();
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('userRole') !== null;
  }

  // Método para obtener el rol del usuario
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Método para obtener los detalles del usuario
  async getUserDetails(): Promise<User | undefined> {
    if (this.users.length === 0) {
      await this.loadUsers();
    }
    const username = localStorage.getItem('username');
    if (!username) {
      return undefined;
    }
    return this.users.find((user) => user.username === username);
  }

  // Método para obtener el usuario actual
  async getUsuarioActual(): Promise<User | undefined> {
    return await this.getUserDetails(); // Usa getUserDetails para obtener el usuario completo
  }

  // Método para obtener todos los roles del usuario (utilizado en el UserDashboardPage)
  getUserRoles(): string[] {
    const role = this.getUserRole();
    return role ? role.split(',').map(r => r.trim()) : [];
  }

  // Método para verificar el rol específico de un usuario (por ejemplo, si es tutor o alumno)
  isRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}
