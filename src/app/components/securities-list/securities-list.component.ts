import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRowDef,
  MatRow,
  MatNoDataRow,
} from '@angular/material/table';
import {
  BehaviorSubject,
  switchMap,
  map,
  distinctUntilChanged,
  shareReplay,
  catchError,
  of,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { indicate, paramsEqual } from '../../utils';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { FormInput } from '../../models/form';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InputComponentsEnum } from '../../constants/form';
import { filtersContext } from '../../contexts/filtersContext';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    AsyncPipe,
    MatPaginatorModule,
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
export class SecuritiesListComponent {
  private readonly _securityService = inject(SecurityService);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns: string[] = ['name', 'type', 'currency'];
  readonly loadingSecurities$ = new BehaviorSubject<boolean>(false);

  private readonly _securitiesResult$ = filtersContext.pipe(
    distinctUntilChanged(paramsEqual),
    switchMap(({ filters, pagination }) =>
      this._securityService
        .getSecurities({
          ...filters,
          skip: pagination.skip * pagination.limit,
          limit: pagination.limit,
        })
        .pipe(
          indicate(this.loadingSecurities$),
          catchError((error) => {
            console.error('Failed to load securities:', error);
            return of({ data: [], total: 0 });
          })
        )
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
    takeUntilDestroyed(this.destroyRef)
  );

  readonly securities$ = this._securitiesResult$.pipe(map((res) => res.data));

  readonly totalResults$ = this._securitiesResult$.pipe(
    map((res) => res.total)
  );

  readonly filterFields: FormInput[] = [
    {
      name: 'name',
      label: 'Name',
      component: InputComponentsEnum.Text,
      columns: 2,
      debounced: true,
      props: { placeholder: 'Search by name' },
    },
    {
      name: 'types',
      label: 'Type',
      component: InputComponentsEnum.Select,
      columns: 2,
      props: {
        options: ['Equity', 'Closed-endFund', 'BankAccount', 'Loan', 'Generic'],
        multiple: true,
      },
    },
    {
      name: 'currencies',
      label: 'Currency',
      component: InputComponentsEnum.Select,
      columns: 2,
      props: { options: ['USD', 'EUR', 'GBP'], multiple: true },
    },
    {
      name: 'isPrivate',
      label: 'Private',
      component: InputComponentsEnum.Checkbox,
      columns: 4,
    },
  ];

  onPageChange(event: PageEvent) {
    const current = filtersContext.value;

    filtersContext.next({
      filters: current.filters,
      pagination: {
        skip: event.pageIndex,
        limit: event.pageSize,
      },
    });
  }
}
