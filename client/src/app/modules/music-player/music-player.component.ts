import {
  Component,
  inject,
  AfterViewInit,
  effect,
  signal,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { MessageService } from '../../shared/signals/message.service';
import { ApiService } from '../../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SongDetails } from '../../interfaces/data.interface';
import { QueueComponent } from '../queue/queue.component';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [SkeletonModule, QueueComponent],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements AfterViewInit, OnDestroy {
  private messageService = inject(MessageService);
  private readonly apiService = inject(ApiService);

  @ViewChild(QueueComponent) queueComponent: QueueComponent | undefined;

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
  musicQueue: SongDetails[] = [];
  currentQueueId = '';
  private hideQueueTimeout: number | undefined;

  constructor() {
    effect(() => {
      const songId = this.currentSongId();
      this.addToQueue(songId);
    });
  }

  ngAfterViewInit() {
    this.audioElement.volume = this.currentVolume() / 100;

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audioElement.currentTime);
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audioElement.duration);
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.onMusicEnd();
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

  addToQueue(songId: string): void {
    if (this.musicQueue.length > 0 && this.musicQueue[0]._id === songId) return;
    this.apiService
      .request('GET', `info/music/${songId}`, null)
      .subscribe(res => {
        this.musicQueue.push({ ...res, queue_id: uuidv4() });
        if (!this.isPlaying()) {
          this.changeSong(this.musicQueue[0]);
        }
      });
  }

  changeSong(songDetails: SongDetails, bypass = false): void {
    if (!this.isPlaying() || bypass) {
      this.audioElement.src = songDetails.url;
      this.imageUrl.set(songDetails.image_url);
      this.name.set(songDetails.name);
      this.artist.set(songDetails.artist);
      this.audioElement.load();
      this.isPlaying.set(true);
      this.audioElement.play();
      this.currentQueueId = songDetails.queue_id;
    }
  }

  onMusicEnd() {
    if (this.musicQueue.length > 0) {
      const currentIndex = this.getCurrentSongIndex();
      this.changeSong(this.musicQueue[currentIndex + 1]);
    }
  }

  showQueue() {
    if (this.hideQueueTimeout) {
      clearTimeout(this.hideQueueTimeout);
    }
    this.queueComponent?.showQueue();
  }

  hideQueue() {
    this.hideQueueTimeout = window.setTimeout(() => {
      const queueIcon = document.querySelector('.queue-icon');
      const queueModal = document.querySelector('.queue-container');

      if (!queueModal?.matches(':hover') && !queueIcon?.matches(':hover')) {
        this.queueComponent?.hideQueue();
      }
    }, 100); // Small delay to allow mouse to reach the modal
  }

  getCurrentSongIndex() {
    return this.musicQueue.findIndex(
      song => song.queue_id === this.currentQueueId
    );
  }

  navigateTrack(direction: 'prev' | 'next') {
    const currentIndex = this.getCurrentSongIndex();
    if (direction === 'prev' && currentIndex > 0) {
      this.changeSong(this.musicQueue[currentIndex - 1], true);
    } else if (
      direction === 'next' &&
      currentIndex < this.musicQueue.length - 1
    ) {
      this.changeSong(this.musicQueue[currentIndex + 1], true);
    }
  }
}
