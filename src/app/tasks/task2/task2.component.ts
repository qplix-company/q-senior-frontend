import {Component, signal, TrackByFunction} from '@angular/core';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {SelectionModel} from '@angular/cdk/collections';

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
})
export class Task2Component {
  rows = signal<Row[]>(createRows())

  selectionModel = new SelectionModel<Row>(true, undefined, undefined, (o1, o2) => o1.id === o2.id)
  trackBy: TrackByFunction<Row> | undefined = (index, item) => item.id;

  recreateData() {
    this.rows.set(createRows())
  }

  selectAll() {
    this.selectionModel.select(...this.rows())
  }

  deselectAll() {
    this.selectionModel.deselect(...this.rows())
  }
}
