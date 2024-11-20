// src/app/solicitud-tutoria/solicitud-tutoria.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudTutoriaPageRoutingModule } from './solicitud-tutoria-routing.module';

import { SolicitudTutoriaPage } from './solicitud-tutoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudTutoriaPageRoutingModule
  ],
  declarations: [SolicitudTutoriaPage]
})
export class SolicitudTutoriaPageModule {}
