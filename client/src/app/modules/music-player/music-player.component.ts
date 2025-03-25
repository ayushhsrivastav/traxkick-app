import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../shared/signals/message.service';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit {
  private messageService = inject(MessageService);
  currentSongId = this.messageService.songId;
  currentTime: number = 0;
  duration: number = 240;
  isPlaying: boolean = false;
  currentVolume: number = 0;
  isLiked: boolean = false;
  audioElement: HTMLAudioElement | null = null;

  ngOnInit() {
    setInterval(() => {
      if (this.isPlaying && this.currentTime < this.duration) {
        this.currentTime++;
      }
      console.log('---->', this.currentSongId());
    }, 1000);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
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
    const width = bounds.width;
    const percentage = x / width;
    this.currentTime = this.duration * percentage;

    if (this.audioElement) {
      this.audioElement.currentTime = this.currentTime;
    }
  }

  updateVolume(event: MouseEvent): void {
    const volumeBar = event.currentTarget as HTMLElement;
    const bounds = volumeBar.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const width = bounds.width;
    const percentage = x / width;
    this.currentVolume = percentage * 100;
  }

  getProgressStyle(): string {
    if (this.duration === 0) return '0%';
    return `${(this.currentTime / this.duration) * 100}%`;
  }

  getVolumeStyle(): string {
    if (this.currentVolume === 0) return '0%';
    return `${(this.currentVolume / 100) * 100}%`;
  }

  changeSong(songId: string): void {
    console.log(songId);
  }
}
