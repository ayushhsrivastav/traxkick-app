import { HttpHeaders, HttpParams } from '@angular/common/http';

export type ApiMethods = 'GET' | 'POST';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json';
  withCredentials?: boolean;
}
