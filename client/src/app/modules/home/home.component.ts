import { Component, inject, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loadingService.hide();
  }
}
