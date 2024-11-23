// clases.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private clasesSubject = new BehaviorSubject<any[]>([]);  // Controla las clases
  clases$ = this.clasesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para cargar las clases
  cargarClases() {
    this.http.get<any[]>('http://localhost:3000/clases').subscribe({
      next: (clases) => {
        this.clasesSubject.next(clases); // Emite las clases cargadas
      },
      error: (error) => {
        console.error('Error al cargar las clases:', error);
      }
    });
  }

  // Método para agregar una nueva clase
  agregarClase(nuevaClase: any) {
    this.http.post('http://localhost:3000/clases', nuevaClase).subscribe({
      next: (claseAgregada) => {
        // Actualizamos el BehaviorSubject con la nueva clase
        const clasesActualizadas = [...this.clasesSubject.getValue(), claseAgregada];
        this.clasesSubject.next(clasesActualizadas); // Emitimos la lista actualizada de clases
      },
      error: (error) => {
        console.error('Error al agregar la clase:', error);
      }
    });
  }
}
