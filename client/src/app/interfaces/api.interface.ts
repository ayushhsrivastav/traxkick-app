import { HttpHeaders, HttpParams } from '@angular/common/http';

export type ApiMethods = 'GET' | 'POST';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json';
  withCredentials?: boolean;
}

export interface Singer {
  _id: string;
  name: string;
  image_url: string;
}

export interface Album {
  _id: string;
  name: string;
  year: number;
  artist_id: string;
  artist_name: string;
  copyright: string;
  image_url: string;
}

export interface Song {
  _id: string;
  name: string;
  image_url: string;
  artist_id: string;
  artist_name: string;
  album_id: string;
  album_name: string;
}
