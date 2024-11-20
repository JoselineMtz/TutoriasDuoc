import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorMenuPage } from './tutor-menu.page';

const routes: Routes = [
  {
    path: '',
    component: TutorMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorMenuPageRoutingModule {}
