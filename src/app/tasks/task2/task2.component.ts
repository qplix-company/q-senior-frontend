import {ChangeDetectionStrategy, Component, signal, TrackByFunction} from '@angular/core';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';

interface Row {
  id: number;
  title: string;
}

function createRows(): Row[] {
  return Array.from({length: 50000}, (_, i) => i).map(i => ({id: i, title: `Item ${i}`}))
}

@Component({
  selector: 'app-task2',
  imports: [
    CdkVirtualScrollViewport,
    MatCheckbox,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    MatButton
  ],
  standalone: true,
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task2Component {
  rows = signal<Row[]>(createRows())
  private selectedIds = new Set<number>();
  trackBy: TrackByFunction<Row> | undefined = (index, item) => item.id;

  recreateData() {
    this.rows.set(createRows())
  }

  selectAll() {
    const next = new Set<number>();
    for (const r of this.rows()) next.add(r.id);
    this.selectedIds = next;
  }

  deselectAll() {
    this.selectedIds = new Set<number>();
  }

  isSelected(row: Row): boolean {
    return this.selectedIds.has(row.id);
  }

  toggle(row: Row) {
    if (this.selectedIds.has(row.id)) {
      this.selectedIds.delete(row.id);
    } else {
      this.selectedIds.add(row.id);
    }
  }
}
