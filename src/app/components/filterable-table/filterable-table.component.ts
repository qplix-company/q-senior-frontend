import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [MatTable, MatPaginator],
  templateUrl: './filterable-table.component.html',
  styleUrl: './filterable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;
  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;

  @Input() isLoading: boolean | null = false;

  @Input() totalCount: number | null = null;

  @Input() pageIndex = 0;

  @Input() pageSize = 25;

  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() page = new EventEmitter<PageEvent>();

  public ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) => this.table?.addColumnDef(columnDef));
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) => this.table?.addHeaderRowDef(headerRowDef));
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
}
