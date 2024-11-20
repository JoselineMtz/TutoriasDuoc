import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditProfileComponent } from './edit-profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditProfileComponent // Asegúrate de que esta línea esté correcta
      }
    ])
  ],
  declarations: [EditProfileComponent]
})
export class EditProfileModule {}
