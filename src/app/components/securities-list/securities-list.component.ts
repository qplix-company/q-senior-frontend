import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Security } from '../../models/security';
import { SecuritiesFilter } from '../../models/securities-filter';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { FilterFieldConfig, FilterFieldOption, FilterValue } from '../../shared/models/filter-field';

const NAME_MIN_LENGTH = 3;
const DEFAULT_PAGE_SIZE = 25;

/** Filter fields for the securities list. Add a new entry here to expose another server-side filter. */
const SECURITIES_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: `Search by name (min ${NAME_MIN_LENGTH} characters)`,
    minLength: NAME_MIN_LENGTH,
  },
  {
    key: 'types',
    label: 'Type',
    type: 'multi-select',
  },
  {
    key: 'currencies',
    label: 'Currency',
    type: 'multi-select',
  },
  {
    key: 'isPrivate',
    label: 'Private',
    type: 'boolean',
  },
];

interface PageState {
  pageIndex: number;
  pageSize: number;
}

/** The three states the securities fetch can be in, driving the table row message switch. */
export type SecuritiesState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Security[] };

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    FilterBarComponent,
    AsyncPipe,
    MatProgressSpinner,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent implements OnInit {
  protected readonly displayedColumns = ['name', 'type', 'currency'];
  protected readonly filterFields = SECURITIES_FILTER_FIELDS;
  protected readonly pageSizeOptions = [10, 25, 50, 100];

  private readonly securityService = inject(SecurityService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const typeField = this.filterFields.find((field) => field.key === 'types');
    const currencyField = this.filterFields.find((field) => field.key === 'currencies');

    this.securityService
      .getSecurityTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((types) => {
        if (typeField) {
          typeField.options = this.toOptions(types);
        }
      });

    this.securityService
      .getCurrencies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currencies) => {
        if (currencyField) {
          currencyField.options = this.toOptions(currencies);
        }
      });
  }

  private toOptions(values: string[]): FilterFieldOption[] {
    return values.map((value) => ({ label: value, value }));
  }

  private readonly filter$ = new BehaviorSubject<FilterValue>({});
  private readonly page$ = new BehaviorSubject<PageState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  protected pageIndex$ = this.page$.pipe(map((page) => page.pageIndex));
  protected pageSize$ = this.page$.pipe(map((page) => page.pageSize));

  protected securitiesState$: Observable<SecuritiesState> = combineLatest([this.filter$, this.page$]).pipe(
    map(([filter, page]) => this.composeSecurityFilter(filter, page)),
    switchMap((requestFilter) => this.loadSecurities(requestFilter))
  );

  /**
   * Total match count from the backend, used to drive the Material paginator.
   */
  protected totalCount$: Observable<number> = this.filter$.pipe(
    switchMap((filter) => this.securityService.getSecuritiesCount(filter))
  );

  protected onFilterChange(filter: FilterValue): void {
    this.filter$.next(filter);
    this.page$.next({ pageIndex: 0, pageSize: this.page$.value.pageSize });
  }

  protected onPageChange(event: PageEvent): void {
    this.page$.next({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  private composeSecurityFilter(filter: FilterValue, page: PageState): SecuritiesFilter {
    return {
      ...filter,
      skip: page.pageIndex * page.pageSize,
      limit: page.pageSize,
    };
  }

  private loadSecurities(filter: SecuritiesFilter): Observable<SecuritiesState> {
    return this.securityService.getSecurities(filter).pipe(
      map((data): SecuritiesState => ({ status: 'success', data })),
      startWith<SecuritiesState>({ status: 'loading' }),
      catchError((error: unknown) => of(this.errorState(error)))
    );
  }

  private errorState(error: unknown): SecuritiesState {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
