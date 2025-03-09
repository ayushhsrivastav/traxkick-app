import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/auth-layout/auth-layout.component').then(
        m => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            m => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./components/signup/signup.component').then(
            m => m.SignupComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
