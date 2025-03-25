import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

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
    canActivate: [LoginGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./modules/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./modules/admin/admin.component').then(m => m.AdminComponent),
      },
      {
        path: 'playlists',
        loadComponent: () =>
          import('./modules/playlist/playlist.component').then(
            m => m.PlaylistComponent
          ),
      },
      {
        path: 'album/:id',
        loadComponent: () =>
          import('./modules/album/album.component').then(m => m.AlbumComponent),
      },
      {
        path: 'song/:id',
        loadComponent: () =>
          import('./modules/song-page/song-page.component').then(
            m => m.SongPageComponent
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
