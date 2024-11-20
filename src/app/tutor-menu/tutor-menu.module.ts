import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorMenuPageRoutingModule } from './tutor-menu-routing.module';

import { TutorMenuPage } from './tutor-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorMenuPageRoutingModule
  ],
  declarations: [TutorMenuPage]
})
export class TutorMenuPageModule {}
