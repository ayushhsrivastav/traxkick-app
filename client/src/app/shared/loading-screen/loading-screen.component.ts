import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent {
  isVisible = false;
}
