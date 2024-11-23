import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash', // Redirige a la página splash como inicio
    pathMatch: 'full' // Es importante que esta opción esté configurada correctamente
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'user-dashboard',
    loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardPageModule),
    canActivate: [AuthGuard] // Aplica el AuthGuard aquí
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfileModule),
    canActivate: [AuthGuard] // Protege la ruta con AuthGuard si es necesario
  },
  {
    path: 'solicitud-tutoria',
    loadChildren: () => import('./solicitud-tutoria/solicitud-tutoria.module').then(m => m.SolicitudTutoriaPageModule)
  },
  {
    path: 'clases',
    loadChildren: () => import('./clases/clases.module').then(m => m.ClasesModule),
    canActivate: [AuthGuard] // Protege la ruta si es necesario
  },
  {
    path: 'agregar-tutoria',
    loadChildren: () => import('./agregar-tutoria/agregar-tutoria.module').then(m => m.AgregarTutoriaPageModule)
  },
  // Ruta comodín para manejar rutas no existentes y redirigir a la página de error 404
  { path: '**', loadChildren: () => import('./e404/e404.module').then(m => m.E404PageModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) // Configura el enrutamiento
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
