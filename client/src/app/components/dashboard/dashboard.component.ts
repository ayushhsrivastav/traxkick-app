import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../modules/top-bar/top-bar.component';
import { MusicPlayerComponent } from '../../modules/music-player/music-player.component';
import { RouterOutlet } from '@angular/router';
import { MessageService } from '../../shared/signals/message.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopBarComponent, MusicPlayerComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private messageService = inject(MessageService);
  showMusicPlayer = this.messageService.songId;
}
