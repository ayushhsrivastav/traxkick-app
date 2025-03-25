import { Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private _song_id = signal<string>('');

  get songId(): Signal<string> {
    return this._song_id;
  }

  changeSongId(newSongId: string) {
    this._song_id.set(newSongId);
  }
}
