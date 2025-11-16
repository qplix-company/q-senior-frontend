import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { FilterField } from '../../models/filter-definition';
import { SECURITIES } from '../../mocks/securities-mocks';
import { PageEvent } from '@angular/material/paginator';
import { SecuritiesFilter } from '../../models/securities-filter';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterBarComponent,
    FilterableTableComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent implements OnInit {
  fields: FilterField[] = [];
  private baseFilter: Partial<SecuritiesFilter> = {};
  protected pageIndex = 0;
  protected pageSize = 10;
  protected filterColumns: string[] = ['name', 'type', 'currency'];

  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private filter$ = new BehaviorSubject<SecuritiesFilter>({ skip: 0, limit: this.pageSize });

  protected securities$: Observable<Security[]> = this.filter$.pipe(
    switchMap((f) =>
      this._securityService.getSecurities(f).pipe(indicate(this.loadingSecurities$))
    )
  );

  protected totalCount$: Observable<number> = this.filter$.pipe(
    switchMap((f) => this._securityService.countSecurities(f))
  );

  ngOnInit(): void {
    const all = SECURITIES;
    const types = Array.from(new Set(all.map((s) => s.type))).sort();
    const currencies = Array.from(new Set(all.map((s) => s.currency))).sort();

    this.fields = [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Search name' },
      { key: 'types', label: 'Types', type: 'multiselect', options: types },
      {
        key: 'currencies',
        label: 'Currencies',
        type: 'multiselect',
        options: currencies,
      },
      {
        key: 'isPrivate',
        label: 'Private',
        type: 'boolean',
        options: [
          { label: 'Private', value: true },
          { label: 'Public', value: false },
        ],
      },
    ];
  }

  onFilterChange(filter: Partial<SecuritiesFilter>) {
    this.baseFilter = filter || {};
    this.pageIndex = 0;
    this.filter$.next({ ...this.baseFilter, skip: 0, limit: this.pageSize });
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const skip = event.pageIndex * event.pageSize;
    this.filter$.next({ ...this.baseFilter, skip, limit: event.pageSize });
  }
}
