import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudTutoriaPage } from './solicitud-tutoria.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudTutoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudTutoriaPageRoutingModule {}
