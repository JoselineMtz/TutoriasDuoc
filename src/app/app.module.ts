import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Asegúrate de que la ruta sea correcta
import { EditProfileModule } from './edit-profile/edit-profile.module'; // Asegúrate de que la ruta sea correcta
import { ClasesModule } from './clases/clases.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    EditProfileModule, // Asegúrate de importar tu módulo de perfil de edición aquí
    ClasesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
