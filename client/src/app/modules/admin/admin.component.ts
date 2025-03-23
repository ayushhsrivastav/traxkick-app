/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Album, Singer, Song } from '../../interfaces/api.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, AvatarModule, ButtonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab: 'singer' | 'album' | 'song' = 'singer';

  selectedSingerId: string | null = null;
  selectedAlbumId: string | null = null;
  selectedSongId: string | null = null;

  currentYear: number = new Date().getFullYear();

  singers: Singer[] = [];

  albums: Album[] = [];

  selectedSingerAlbums: Album[] = [];

  songs: Song[] = [];

  singerForm: { name: string; image_url: string } = {
    name: '',
    image_url: '',
  };

  albumForm: {
    name: string;
    image_url: string;
    year: number;
    artist_id: string | null;
    copyright: string;
  } = {
    name: '',
    image_url: '',
    year: this.currentYear,
    artist_id: null,
    copyright: '',
  };

  songForm: {
    name: string;
    artist_id: string | null;
    album_id: string | null;
    image_url: string;
    file: File | null;
  } = {
    name: '',
    artist_id: null,
    album_id: null,
    image_url: '',
    file: null,
  };

  async ngOnInit(): Promise<void> {
    this.loadingService.show();
    this.authService.checkAdminUser().subscribe({
      next: (res: any) => {
        if (!res) {
          this.router.navigate(['/not-found']);
          return;
        }
      },
    });
    await this.fetchDetails();
  }

  async fetchDetails(): Promise<void> {
    return new Promise(resolve => {
      this.loadingService.show();
      this.apiService.request('GET', 'info/get-details', {}).subscribe({
        next: (res: any) => {
          this.singers = res.singerDetails || [];
          this.albums = res.albumDetails || [];
          this.songs = res.songDetails || [];
          this.loadingService.hide();
          resolve();
        },
        error: (err: any) => {
          this.loadingService.hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message || err.message || 'Failed to fetch details',
            closable: false,
          });
          resolve();
        },
      });
    });
  }

  setActiveTab(tab: 'singer' | 'album' | 'song'): void {
    this.activeTab = tab;
    this.resetForms();
  }

  resetForms(): void {
    this.selectedSingerId = null;
    this.selectedAlbumId = null;
    this.selectedSongId = null;
    this.selectedSingerAlbums = [];

    this.singerForm = {
      name: '',
      image_url: '',
    };

    this.albumForm = {
      name: '',
      image_url: '',
      year: new Date().getFullYear(),
      artist_id: null,
      copyright: '',
    };

    this.songForm = {
      name: '',
      artist_id: null,
      album_id: null,
      image_url: '',
      file: null,
    };
  }

  onSongFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.songForm.file = file;
    } else {
      this.songForm.file = null;
    }
  }

  onSingerChange(): void {
    this.singerForm.name =
      this.singers.find(singer => singer._id === this.selectedSingerId)?.name ||
      '';
    this.singerForm.image_url =
      this.singers.find(singer => singer._id === this.selectedSingerId)
        ?.image_url || '';
  }

  onAlbumChange(): void {
    const album = this.albums.find(album => album._id === this.selectedAlbumId);
    if (!album) {
      return;
    }
    this.albumForm.name = album.name;
    this.albumForm.image_url = album.image_url;
    this.albumForm.year = album.year;
    if (album.artist_id) {
      this.albumForm.artist_id = album.artist_id;
    }
    if (album.copyright) {
      this.albumForm.copyright = album.copyright;
    }
  }

  onSongChange(): void {
    const song = this.songs.find(song => {
      return song._id === this.selectedSongId;
    });
    if (!song) {
      return;
    }
    this.songForm.name = song.name;
    this.songForm.artist_id = song.artist_id;
    this.songForm.album_id = song.album_id;
    this.songForm.image_url = song.image_url;
    this.onSingerChangeInSong();
  }

  onSingerChangeInSong(): void {
    this.selectedSingerAlbums = this.albums.filter(
      album => album.artist_id === this.songForm.artist_id
    );
  }

  submitSingerForm(): void {
    if (!this.singerForm.name || !this.singerForm.image_url) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    const { name, image_url } = this.singerForm;

    this.loadingService.show();
    if (this.selectedSingerId) {
      this.apiService
        .request('POST', 'upload/update-artist', {
          _id: this.selectedSingerId,
          name,
          image_url,
        })
        .subscribe({
          next: async (res: any) => {
            if (res?.status === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message || 'Artist updated successfully',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message || 'Failed to update artist',
              });
            }
            await this.fetchDetails();
          },
          error: async (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                err.error.message || err.message || 'Failed to update artist',
            });
            await this.fetchDetails();
          },
        });
    } else {
      this.apiService
        .request('POST', 'upload/insert-artist', {
          name,
          image_url,
        })
        .subscribe({
          next: async (res: any) => {
            if (res?.status === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Artist added successfully with id: ' + res.artist_id,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message || 'Failed to add artist',
              });
            }
            await this.fetchDetails();
          },
          error: async (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                err.error.message || err.message || 'Failed to add artist',
            });
            await this.fetchDetails();
          },
        });
    }

    this.resetForms();
  }

  submitAlbumForm(): void {
    if (
      !this.albumForm.name ||
      !this.albumForm.image_url ||
      !this.albumForm.year ||
      !this.albumForm.artist_id
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    const { name, image_url, year, artist_id, copyright } = this.albumForm;

    this.loadingService.show();
    if (this.selectedAlbumId) {
      this.apiService
        .request('POST', 'upload/update-album', {
          _id: this.selectedAlbumId,
          name,
          image_url,
          year,
          artist_id,
          copyright,
        })
        .subscribe({
          next: async (res: any) => {
            if (res?.status === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message || 'Album updated successfully',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message || 'Failed to update album',
              });
            }
            await this.fetchDetails();
          },
          error: async (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                err.error.message || err.message || 'Failed to update album',
            });
            await this.fetchDetails();
          },
        });
    } else {
      this.apiService
        .request('POST', 'upload/insert-album', {
          name,
          image_url,
          year,
          artist_id,
          copyright,
        })
        .subscribe({
          next: async (res: any) => {
            if (res?.status === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Album added successfully with id: ' + res.album_id,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message || 'Failed to add album',
              });
            }
            await this.fetchDetails();
          },
          error: async (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message || err.message || 'Failed to add album',
            });
            await this.fetchDetails();
          },
        });
    }

    this.resetForms();
  }

  submitSongForm(): void {
    if (
      !this.songForm.name ||
      !this.songForm.image_url ||
      !this.songForm.artist_id ||
      !this.songForm.album_id
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    const { name, image_url, artist_id, album_id } = this.songForm;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image_url', image_url);
    formData.append('artist_id', artist_id);
    if (album_id) formData.append('album_id', album_id);
    if (this.songForm.file) formData.append('file', this.songForm.file);

    this.loadingService.show();
    if (this.selectedSongId) {
      formData.append('_id', this.selectedSongId);
      this.apiService
        .request('POST', 'upload/update-song', formData)
        .subscribe({
          next: async (res: any) => {
            if (res?.status === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message || 'Song updated successfully',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message || 'Failed to update song',
              });
            }
            await this.fetchDetails();
          },
          error: async (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                err.error.message || err.message || 'Failed to update song',
            });
            await this.fetchDetails();
          },
        });
    } else {
      this.apiService
        .request('POST', 'upload/insert-song', formData)
        .subscribe({
          next: async (res: any) => {
            if (res?.status === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Song added successfully with id: ' + res.song_id,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message || 'Failed to add song',
              });
            }
            await this.fetchDetails();
          },
          error: async (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message || err.message || 'Failed to add song',
            });
            await this.fetchDetails();
          },
        });
    }
    this.resetForms();
  }
}
