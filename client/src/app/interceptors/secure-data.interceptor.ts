import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
let refreshing = false;

export const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);
  const serverUrl = environment.serverUrl;

  return next(req).pipe(
    catchError(error => {
      if (error.status === 403 && !refreshing) {
        refreshing = true;
        return http
          .post(
            `${serverUrl}/auth/refresh-token`,
            {},
            { withCredentials: true }
          )
          .pipe(
            switchMap(() => {
              refreshing = false;
              return next(req);
            }),
            catchError(err => {
              refreshing = false;
              return throwError(() => err);
            })
          );
      }
      return throwError(() => error);
    })
  );
};
