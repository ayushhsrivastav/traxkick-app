import {
  Component,
  inject,
  OnInit,
  effect,
  signal,
  OnDestroy,
} from '@angular/core';
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
export class MusicPlayerComponent implements OnInit, OnDestroy {
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
  isDragging = signal(false);
  activeSlider: 'progress' | 'volume' | null = null;
  private previousVolume = 50;
  isMuted = signal(false);

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

    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  ngOnDestroy() {
    // Stop the music
    this.audioElement.pause();
    this.audioElement.src = '';
    this.isPlaying.set(false);

    // Clean up event listeners
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));

    // Remove audio event listeners
    this.audioElement.removeEventListener('timeupdate', () => {
      this.currentTime.set(this.audioElement.currentTime);
    });
    this.audioElement.removeEventListener('loadedmetadata', () => {
      this.duration.set(this.audioElement.duration);
    });
    this.audioElement.removeEventListener('ended', () => {
      this.isPlaying.set(false);
    });
  }

  toggleMute() {
    if (this.isMuted()) {
      const newVolume = this.previousVolume === 0 ? 10 : this.previousVolume;
      this.currentVolume.set(newVolume);
      this.audioElement.volume = newVolume / 100;
      this.isMuted.set(false);
    } else {
      this.previousVolume = this.currentVolume();
      this.currentVolume.set(0);
      this.audioElement.volume = 0;
      this.isMuted.set(true);
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging() || !this.activeSlider) return;

    const slider = document.querySelector(
      `.${this.activeSlider}-slider`
    ) as HTMLElement;
    if (!slider) return;

    const bounds = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    const percentage = x / bounds.width;

    if (this.activeSlider === 'progress') {
      const newTime = this.duration() * percentage;
      this.audioElement.currentTime = newTime;
      this.currentTime.set(newTime);
    } else {
      const newVolume = percentage * 100;
      this.currentVolume.set(newVolume);
      this.audioElement.volume = percentage;
      this.isMuted.set(newVolume === 0);
    }
  }

  onMouseUp() {
    this.isDragging.set(false);
    this.activeSlider = null;
  }

  startDrag(event: MouseEvent, type: 'progress' | 'volume') {
    event.preventDefault();
    this.isDragging.set(true);
    this.activeSlider = type;
    this.updateValue(event, type);
  }

  updateValue(event: MouseEvent, type: 'progress' | 'volume') {
    const slider = event.currentTarget as HTMLElement;
    const bounds = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    const percentage = x / bounds.width;

    if (type === 'progress') {
      const newTime = this.duration() * percentage;
      this.audioElement.currentTime = newTime;
      this.currentTime.set(newTime);
    } else {
      const newVolume = percentage * 100;
      this.currentVolume.set(newVolume);
      this.audioElement.volume = percentage;
      this.isMuted.set(newVolume === 0);
    }
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
