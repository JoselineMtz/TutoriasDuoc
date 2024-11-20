import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component'; // Importa tu componente

const routes: Routes = [
  {
    path: '',
    component: EditProfileComponent // Establece el componente para esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProfileRoutingModule {}
