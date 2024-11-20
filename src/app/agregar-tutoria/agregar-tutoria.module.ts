// agregar-tutoria.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgregarTutoriaPageRoutingModule } from './agregar-tutoria-routing.module';
import { AgregarTutoriaPage } from './agregar-tutoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarTutoriaPageRoutingModule
  ],
  declarations: [AgregarTutoriaPage]
})
export class AgregarTutoriaPageModule {}
