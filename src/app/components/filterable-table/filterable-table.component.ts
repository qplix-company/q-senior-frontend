import { DataSource } from '@angular/cdk/collections';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { Observable } from 'rxjs';
import { FilterControlBase } from '../filter-bar/controls/filter-controls-base';

@Component({
  selector: 'filterable-table',
  templateUrl: './filterable-table.component.html',
  styleUrls: ['./filterable-table.component.scss'],
})
export class FilterableTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table: MatTable<T>;

  @Input() columns: string[];

  @Input() dataSource: readonly T[] | DataSource<T> | Observable<readonly T[]>;
  @Input() isLoading: boolean;

  @Input() isFilterLoading: boolean;
  @Input() filterData: readonly FilterControlBase[];

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach((rowDef) => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach((headerRowDef) =>
      this.table.addHeaderRowDef(headerRowDef)
    );
    this.table.setNoDataRow(this.noDataRow);
  }
}
