import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AlbumDetails } from '../../interfaces/data.interface';
import { LoadingService } from '../../services/loading.service';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { MessageService } from '../../shared/signals/message.service';
@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private readonly loadingService = inject(LoadingService);
  private readonly messageService = inject(MessageService);
  private routeSubscription!: Subscription;

  album: AlbumDetails | null = null;

  currentSongIndex: number | null = null;
  buttonPosition = { x: 0 };

  ngOnInit(): void {
    this.loadingService.show();
    this.routeSubscription = this.route.params.subscribe(params => {
      this.apiService
        .request('GET', `info/album/${params['id']}`, null)
        .subscribe(res => {
          this.loadingService.hide();
          this.album = res;
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onMouseMove(event: MouseEvent, index: number) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.currentSongIndex = index;
    this.buttonPosition = {
      x: event.clientX - rect.left,
    };
  }

  onMouseLeave() {
    this.currentSongIndex = null;
  }

  changeSong(songId: string) {
    this.messageService.changeSongId(songId);
  }
}
