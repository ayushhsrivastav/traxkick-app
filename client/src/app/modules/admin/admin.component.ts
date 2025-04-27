/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Album, Singer, Song } from '../../interfaces/data.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    AvatarModule,
    ButtonModule,
    MultiSelectModule,
    DialogModule,
    CheckboxModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements AfterViewInit {
  private loadingService = inject(LoadingService);
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab: 'singer' | 'album' | 'song' = 'singer';

  visible: boolean = false;

  selectedSingerId: string | null = null;
  selectedAlbumId: string | null = null;
  selectedSongId: string | null = null;
  leadSingers: string[] = [];
  featuredSingers: string[] = [];

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
    artist_ids: string[];
    album_id: string | null;
    image_url: string;
    file: File | null;
  } = {
    name: '',
    artist_ids: [],
    album_id: null,
    image_url: '',
    file: null,
  };

  async ngAfterViewInit(): Promise<void> {
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
      artist_ids: [],
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
    this.songForm.artist_ids = song.artist_ids;
    if (song.featured_artist_ids) {
      this.songForm.artist_ids = this.songForm.artist_ids.concat(
        song.featured_artist_ids
      );
    }
    this.leadSingers = song.artist_ids || [];
    this.featuredSingers = song.featured_artist_ids || [];
    this.songForm.album_id = song.album_id;
    this.songForm.image_url = song.image_url;
    this.onSingerChangeInSong();
  }

  onSingerChangeInSong(): void {
    this.selectedSingerAlbums = this.albums.filter(album =>
      album.artist_id.includes(this.songForm.artist_ids[0])
    );
  }

  onSingerSelectionChange(): void {
    if (this.songForm.artist_ids.length === 1) {
      this.leadSingers = this.songForm.artist_ids;
    } else if (this.songForm.artist_ids.length > 1) {
      this.visible = true;
    }
    if (this.leadSingers.length > 0) {
      this.selectedSingerAlbums = this.albums.filter(album =>
        this.leadSingers.some(singerId => album.artist_id.includes(singerId))
      );
    } else {
      this.selectedSingerAlbums = [];
      this.songForm.album_id = null;
    }
  }

  getSingerName(artistId: string): string {
    return this.singers.find(singer => singer._id === artistId)?.name || '';
  }

  onSaveSingers(): void {
    if (
      this.leadSingers.length + this.featuredSingers.length !==
      this.songForm.artist_ids.length
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select all singers',
      });
      return;
    } else if (this.leadSingers.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one lead singer',
      });
      return;
    }
    this.onSingerSelectionChange();
    this.visible = false;
  }

  onCancelSingers(): void {
    this.visible = false;
    this.songForm.artist_ids = [];
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
      this.songForm.artist_ids.length === 0 ||
      this.leadSingers.length === 0 ||
      !this.songForm.album_id
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    const { name, image_url, album_id } = this.songForm;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image_url', image_url);
    this.leadSingers.forEach(id => formData.append('lead_artist_ids[]', id));
    this.featuredSingers.forEach(id =>
      formData.append('featured_artist_ids[]', id)
    );
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
