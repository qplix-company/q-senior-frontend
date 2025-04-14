import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  ViewChild,
  AfterViewInit,
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
  Observable,
  BehaviorSubject,
  combineLatest,
  switchMap,
  tap,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { FormInput } from '../../models/form';
import { InputComponentsEnum } from '../../constants/form';
import { createTrigger } from '../../helpers/sequritiesListHelper';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    AsyncPipe,
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
export class SecuritiesListComponent implements AfterViewInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  private readonly _securityService = inject(SecurityService);

  @ViewChild(FilterableTableComponent)
  tableComponent!: FilterableTableComponent<Security>;

  readonly displayedColumns: string[] = ['name', 'type', 'currency'];
  readonly loadingSecurities$ = new BehaviorSubject<boolean>(false);
  readonly totalResults$ = new BehaviorSubject<number>(0);

  private readonly _filters$ = new BehaviorSubject<Record<string, any>>({});

  private readonly _trigger$ = createTrigger(combineLatest([this._filters$]));

  readonly securities$: Observable<Security[]> = this._trigger$.pipe(
    switchMap(([filters]) =>
      this._securityService
        .getSecurities({
          ...filters,
        })
        .pipe(
          indicate(this.loadingSecurities$),
          map((res) => res)
        )
    ),
    takeUntil(this._destroy$)
  );

  readonly filterFields: FormInput[] = [
    {
      name: 'name',
      label: 'Name',
      component: InputComponentsEnum.Text,
      columns: 2,
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

  ngAfterViewInit(): void {
    this.tableComponent.filters$
      .pipe(takeUntil(this._destroy$))
      .subscribe((filters: Record<string, any>) => {
        this._filters$.next(filters);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
