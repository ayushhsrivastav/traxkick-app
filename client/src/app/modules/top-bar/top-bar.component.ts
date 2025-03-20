import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  private readonly router = inject(Router);
  isHome: boolean = false;
  username: string = 'Ayush';
  profileImage: string | null = null;
  backgroundColor: string;

  private colors = [
    '#1DB954', // Spotify green
    '#537FE7', // Blue
    '#E7537F', // Pink
    '#53E7C0', // Turquoise
    '#E75353', // Red
    '#9B53E7', // Purple
    '#E7C053', // Gold
    '#53E76F', // Light green
    '#E75394', // Rose
    '#5394E7', // Light blue
  ];

  constructor() {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/home';
    });
    this.backgroundColor = this.getRandomColor();
  }

  getFirstLetter(): string {
    return this.username.charAt(0).toUpperCase();
  }

  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}
