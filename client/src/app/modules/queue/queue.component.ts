import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongDetails } from '../../interfaces/data.interface';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss',
})
export class QueueComponent {
  @Input() musicQueue: SongDetails[] = [];
  @Output() musicQueueChange = new EventEmitter<SongDetails[]>();
  @Input() currentQueueId: string = '';

  isVisible = signal(false);

  showQueue() {
    this.isVisible.set(true);
  }

  hideQueue() {
    this.isVisible.set(false);
  }

  onDrop(event: CdkDragDrop<SongDetails[]>) {
    const newQueue = [...this.musicQueue];
    moveItemInArray(newQueue, event.previousIndex, event.currentIndex);
    this.musicQueueChange.emit(newQueue);
  }
}
