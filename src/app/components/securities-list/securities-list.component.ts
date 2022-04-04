import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  PagingFilter,
  SecuritiesFilter,
} from 'src/app/models/securitiesFilter';
import { FilteredSecurities } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { indicate } from '../../utils';
import { FilterControlBase } from '../filter-bar/controls/filter-controls-base';

@Component({
  selector: 'securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss'],
})
export class SecuritiesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['name', 'type', 'currency'];

  public securities$: Observable<FilteredSecurities>;
  public loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  public filters$: Observable<FilterControlBase[]>;
  public loadingFilters$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public securityCount: number;

  private _activeFilter: SecuritiesFilter;

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.filters$ = this.securityService
      .getSecuritiesFilterMeta()
      .pipe(indicate(this.loadingFilters$));
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.updateSecurities())).subscribe();
  }

  onFilterChanged(filter: SecuritiesFilter) {
    this._activeFilter = filter;

    // once the filter changes, the current page index needs to be reset
    this.paginator.pageIndex = 0;
    this.updateSecurities();
  }

  /**
   * Requests securities from the server based on the currently active filter and paging filter
   */
  private updateSecurities() {
    const activePagingFilter: PagingFilter = {
      limit:
        this.paginator.pageIndex * this.paginator.pageSize +
        this.paginator.pageSize,
      skip: this.paginator.pageIndex * this.paginator.pageSize,
    };

    // merge both filters
    const combinedFilter = { ...this._activeFilter, ...activePagingFilter };

    this.securities$ = this.securityService
      .getSecurities(combinedFilter)
      .pipe(indicate(this.loadingSecurities$))
      .pipe(tap((data) => this.updateSecurityCount(data.totalCount)));
  }

  private updateSecurityCount(newCount: number) {
    this.securityCount = newCount;
  }
}
