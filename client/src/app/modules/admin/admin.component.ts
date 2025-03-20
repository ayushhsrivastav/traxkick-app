/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

interface Singer {
  _id: number;
  name: string;
  profileImage: string;
}

interface Album {
  _id: number;
  name: string;
  imageUrl: string;
  year: number;
  singerId: number;
  singerName: string;
  copyright: string;
}

interface Song {
  _id: number;
  name: string;
  singerId: number;
  singerName: string;
  albumId: number;
  albumName: string;
  imageUrl: string;
  songFile: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private apiService = inject(ApiService);
  // private messageService = inject(MessageService);

  activeTab: 'singer' | 'album' | 'song' = 'singer';

  // Selection trackers - adding these properties to fix the error
  selectedSingerId: number | null = null;
  selectedAlbumId: number | null = null;
  selectedSongId: number | null = null;

  // Mock data for examples
  singers: Singer[] = [];

  albums: Album[] = [];

  songs: Song[] = [];

  // Form models
  singerForm = {
    name: '',
    profileImage: '',
  };

  albumForm = {
    name: '',
    imageUrl: '',
    year: new Date().getFullYear(),
    singerId: 0,
    copyright: '',
  };

  songForm = {
    name: '',
    singerId: 0,
    albumId: 0,
    imageUrl: '',
    songFile: '',
  };

  ngOnInit(): void {
    this.loadingService.show();
    this.fetchDetails();
  }

  fetchDetails(): void {
    this.apiService.request('GET', 'admin/details', {}).subscribe({
      next: (res: any) => {
        this.singers = res.singers;
        this.albums = res.albums;
        this.songs = res.songs;
        this.loadingService.hide();
      },
      error: (err: any) => {
        console.error(err);
        this.loadingService.hide();
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: err.error.message || err.message || 'Failed to fetch details',
        // });
      },
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

    this.singerForm = {
      name: '',
      profileImage: '',
    };

    this.albumForm = {
      name: '',
      imageUrl: '',
      year: new Date().getFullYear(),
      singerId: 0,
      copyright: '',
    };

    this.songForm = {
      name: '',
      singerId: 0,
      albumId: 0,
      imageUrl: '',
      songFile: '',
    };
  }

  // File handling for profile image
  onProfileImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, just store the file name
      this.singerForm.profileImage = file.name;
    }
  }

  // File handling for song upload
  onSongFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, just store the file name
      this.songForm.songFile = file.name;
    }
  }

  // Form submissions
  submitSingerForm(): void {
    // Validate required fields
    if (!this.singerForm.name || !this.singerForm.profileImage) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Singer form submitted:', this.singerForm);
    // Here you would typically call a service to save the data

    // Reset form after submission
    this.resetForms();
  }

  submitAlbumForm(): void {
    // Validate required fields
    if (
      !this.albumForm.name ||
      !this.albumForm.imageUrl ||
      !this.albumForm.year ||
      !this.albumForm.singerId
    ) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Album form submitted:', this.albumForm);
    // Reset form after submission
    this.resetForms();
  }

  submitSongForm(): void {
    // Validate required fields
    if (
      !this.songForm.name ||
      !this.songForm.imageUrl ||
      !this.songForm.singerId ||
      !this.songForm.albumId
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Song file is required only for new songs
    if (!this.selectedSongId && !this.songForm.songFile) {
      alert('Please provide a song file URL');
      return;
    }

    console.log('Song form submitted:', this.songForm);
    // Reset form after submission
    this.resetForms();
  }
}
