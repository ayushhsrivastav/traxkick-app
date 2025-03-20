import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshing = false;
  private http = inject(HttpClient);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 403 && !this.refreshing) {
          this.refreshing = true;
          return this.http.post('/auth/refresh-token', {}).pipe(
            switchMap(() => {
              this.refreshing = false;
              return next.handle(req);
            }),
            catchError(err => {
              this.refreshing = false;
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
