import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash', // Redirige a la página splash como inicio
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'menu-page',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
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
    path: 'e404',
    loadChildren: () => import('./e404/e404.module').then(m => m.E404PageModule)
  },
  {
    path: 'clases', // Nueva ruta para el componente de clases
    loadChildren: () => import('./clases/clases.module').then(m => m.ClasesModule), // Asegúrate de que el módulo esté creado
    canActivate: [AuthGuard] // Protege la ruta si es necesario
  },
  
  {
    path: 'agregar-tutoria',
    loadChildren: () => import('./agregar-tutoria/agregar-tutoria.module').then(m => m.AgregarTutoriaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) // Configura el enrutamiento
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
