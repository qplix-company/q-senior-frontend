import {Component, signal} from '@angular/core';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {SelectionModel} from '@angular/cdk/collections';

interface Row {
  id: number;
  title: string;
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
  rows = signal<Row[]>(Array.from({length: 100000}, (_, i) => i).map(i => ({id: i, title: `Item ${i}`})))

  selectionModel = new SelectionModel(true)

  selectAll() {
    this.selectionModel.select(...this.rows())
  }

  deselectAll() {
    this.selectionModel.deselect(...this.rows())
  }
}
