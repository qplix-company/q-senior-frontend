import { ChangeDetectionStrategy, Component, signal, TrackByFunction } from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

interface Row {
  id: number;
  title: string;
}

function createRows(): Row[] {
  return Array.from({ length: 50000 }, (_, i) => i).map((i) => ({ id: i, title: `Item ${i}` }));
}

@Component({
  selector: 'app-task2',
  imports: [
    CdkVirtualScrollViewport,
    MatCheckbox,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    MatButton,
  ],
  standalone: true,
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task2Component {
  rows = signal<Row[]>(createRows());
  selectedIds = signal<Set<number>>(new Set<number>());

  trackBy: TrackByFunction<Row> = (_index, item) => item.id;

  recreateData(): void {
    this.rows.set(createRows());
  }

  selectAll(): void {
    this.selectedIds.set(new Set(this.rows().map((row) => row.id)));
  }

  deselectAll(): void {
    this.selectedIds.set(new Set<number>());
  }

  isSelected(row: Row): boolean {
    return this.selectedIds().has(row.id);
  }

  toggle(row: Row): void {
    const next = new Set(this.selectedIds());

    if (next.has(row.id)) {
      next.delete(row.id);
    } else {
      next.add(row.id);
    }

    this.selectedIds.set(next);
  }
}
