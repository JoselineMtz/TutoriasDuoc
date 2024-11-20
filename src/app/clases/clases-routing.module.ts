import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClasesComponent } from './clases.component'; // Cambiado a ClasesComponent

const routes: Routes = [
  {
    path: '',
    component: ClasesComponent // Cambiado a ClasesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasesRoutingModule {}
