/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly serverUrl = environment.serverUrl;
  constructor() {}

  login(username: string, password: string) {
    return this.http
      .post<any>(
        `${this.serverUrl}/client/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .pipe(tap(() => this.checkAuth()));
  }

  signup(username: string, email: string, password: string) {
    return this.http
      .post<any>(
        `${this.serverUrl}/client/signup`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      )
      .pipe(tap(() => this.checkAuth()));
  }

  checkAuth(): Observable<{ authenticated: boolean }> {
    return this.http.get<{ authenticated: boolean }>(
      `${this.serverUrl}/auth/check-auth`,
      { withCredentials: true }
    );
  }

  checkAdminUser(): Observable<boolean> {
    return this.http.get<boolean>(`${this.serverUrl}/auth/role`, {
      withCredentials: true,
    });
  }

  logout(): void {
    this.http
      .get(`${this.serverUrl}/client/logout`, {
        withCredentials: true,
      })
      .subscribe(() => {
        this.cookieService.deleteAll();
        window.location.href = '/login';
      });
  }
}
