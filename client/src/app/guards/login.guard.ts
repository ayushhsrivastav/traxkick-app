import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      map(res => {
        if (res.authenticated) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        return [true];
      })
    );
  }
}
