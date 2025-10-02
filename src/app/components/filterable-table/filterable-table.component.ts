import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterField } from '../../models/filter-config';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { SECURITIES } from '../../mocks/securities-mocks';
import { Security } from '../../models/security';
import { FilterService } from '../../shared/filter.service';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [MatProgressSpinner, MatTable, FilterBarComponent],
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
  @Input() columns: string[] = [];

  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = true;
  @Output() filterEventChanged = new EventEmitter<Partial<any>>();
  @Output() clearFilterChanged = new EventEmitter<Partial<any>>();
  filter: any = { skip: 0, limit: 5 };
  fields: FilterField[] = [];
  securities: Security[] = SECURITIES;
  private _filterService = inject(FilterService);

  ngOnInit() {
    this.fields = this._filterService.buildFilterFieldsFromSecurities(
      this.securities
    );
  }

  public ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) =>
      this.table?.addColumnDef(columnDef)
    );
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) =>
      this.table?.addHeaderRowDef(headerRowDef)
    );
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
  onFilterChanged(event: any) {
    this.filterEventChanged.emit(event);
  }
  onClearFilter(event: any) {
    this.clearFilterChanged.emit(event);
  }
}
