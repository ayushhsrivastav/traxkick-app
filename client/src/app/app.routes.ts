import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '/login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        mod => mod.LoginComponent
      ),
  },
  {
    path: '/home',
    loadComponent: () =>
      import('./components/home/home.component').then(mod => mod.HomeComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        mod => mod.NotFoundComponent
      ),
  },
];
