import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination-bar',
  standalone: true,
  imports: [CommonModule, MatPaginator],
  templateUrl: './pagination-bar.component.html',
  styleUrl: './pagination-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBarComponent {
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50, 100];
  @Output() pageChange = new EventEmitter<{ skip: number; limit: number }>();

  onPageChanged(event: PageEvent) {
    const newSkip = event.pageIndex * event.pageSize;
    if (newSkip >= this.length) {
      this.pageIndex = Math.max(
        0,
        Math.floor((this.length - 1) / event.pageSize)
      );
      return;
    }
    this.pageIndex = event.pageIndex;
    const skip = newSkip;
    const limit = event.pageSize;
    this.pageChange.emit({ skip, limit });
  }
}
