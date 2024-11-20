import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClasesRoutingModule } from './clases-routing.module';
import { ClasesComponent } from './clases.component'; // Cambiado a ClasesComponent

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClasesRoutingModule
  ],
  declarations: [ClasesComponent] // Cambiado a ClasesComponent
})
export class ClasesModule {}
