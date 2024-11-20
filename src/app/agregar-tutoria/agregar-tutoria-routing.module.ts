// agregar-tutoria-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarTutoriaPage } from './agregar-tutoria.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarTutoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarTutoriaPageRoutingModule {}
