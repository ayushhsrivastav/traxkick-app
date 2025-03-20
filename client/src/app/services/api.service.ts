/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = environment.serverUrl;
  constructor() {}

  request(method: string, url: string, body: any) {
    return this.http.request<any>(method, `${this.serverUrl}/${url}`, {
      body,
      withCredentials: true,
    });
  }
}
