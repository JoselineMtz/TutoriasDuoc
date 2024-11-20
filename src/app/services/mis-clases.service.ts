// src/app/services/mis-clases.service.ts

import { Injectable } from '@angular/core';

export interface SolicitudAceptada {
  id: string;
  asignatura: string;
  franjaHoraria: string;
  mensajeInteres: string;
  solicitanteId: string;
  solicitanteNombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class MisClasesService {
  private clases: SolicitudAceptada[] = [

    // Agrega más clases según sea necesario
  ];

  constructor() {}

  obtenerClases(): SolicitudAceptada[] {
    return this.clases;
  }
}
