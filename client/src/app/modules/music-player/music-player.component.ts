import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { MessageService } from '../../shared/signals/message.service';
import { ApiService } from '../../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit {
  private messageService = inject(MessageService);
  private readonly apiService = inject(ApiService);

  currentSongId = this.messageService.songId;
  currentTime = signal(0);
  duration = signal(240);
  isPlaying = signal(false);
  currentVolume = signal(50);
  isLiked = signal(false);
  imageUrl = signal('');
  name = signal('');
  artist = signal('');
  audioElement: HTMLAudioElement = new Audio();

  constructor() {
    effect(() => {
      const songId = this.currentSongId();
      this.changeSong(songId);
    });
  }

  ngOnInit() {
    this.audioElement.volume = this.currentVolume() / 100;

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audioElement.currentTime);
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audioElement.duration);
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.isPlaying.set(!this.isPlaying());
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  updateProgress(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const bounds = progressBar.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const percentage = x / bounds.width;
    this.audioElement.currentTime = this.duration() * percentage;
    this.currentTime.set(this.audioElement.currentTime);
  }

  updateVolume(event: MouseEvent): void {
    const volumeBar = event.currentTarget as HTMLElement;
    const bounds = volumeBar.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const percentage = x / bounds.width;
    this.currentVolume.set(percentage * 100);
    this.audioElement.volume = percentage;
  }

  getProgressStyle(): string {
    if (this.duration() === 0) return '0%';
    return `${(this.currentTime() / this.duration()) * 100}%`;
  }

  getVolumeStyle(): string {
    return `${this.currentVolume()}%`;
  }

  changeSong(songId: string): void {
    this.audioElement.src = '';
    this.imageUrl.set('');
    this.name.set('');
    this.artist.set('');
    this.apiService
      .request('GET', `info/music/${songId}`, null)
      .subscribe(res => {
        this.audioElement.src = res.url;
        this.imageUrl.set(res.image_url);
        this.name.set(res.name);
        this.artist.set(res.artist);
        this.audioElement.load();
        this.isPlaying.set(true);
        this.audioElement.play();
      });
  }
}
