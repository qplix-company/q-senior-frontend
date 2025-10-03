import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
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
import { Observable, BehaviorSubject } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PaginationBarComponent } from '../pagination-bar/pagination-bar.component';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    CommonModule,
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
    FilterableTableComponent,
    PaginationBarComponent,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];

  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  protected securities$: Observable<Security[]> = this._securityService
    .getSecurities({})
    .pipe(indicate(this.loadingSecurities$));

  @ViewChild(PaginationBarComponent) pagination!: PaginationBarComponent;

  protected totalCount: number = 0;
  protected pageSizeOptions: number[] = [10, 20, 50, 100];
  protected filter: any = { skip: 0, limit: 10 };

  ngOnInit() {
    this.getSecuritiesList(this.filter);
  }
  onFilterChanged(event: any) {
    if (!event || Object.keys(event).length === 0) {
      this.filter = { skip: 0, limit: 10 };
    } else {
      this.filter.skip = 0;
      this.filter = { ...this.filter, ...event };
    }
    if (this.pagination) {
      this.pagination.pageIndex = 0;
    }
    this.getSecuritiesList(this.filter);
  }

  onPageChange(event: { skip: number; limit: number }) {
    if (!event || !this.filter) {
      return;
    }

    this.filter.skip = event.skip;
    this.filter.limit = event.limit;

    if (event.skip >= this.totalCount) {
      // Reset paginator to last valid page
      if (this.pagination) {
        this.pagination.pageIndex = Math.floor(event.skip / event.limit);
      }
      return;
    }

    this.getSecuritiesList(this.filter);
  }
  getSecuritiesList(filterData: any) {
    const activeFilter = { ...filterData };
    this.securities$ = this._securityService
      .getSecurities(activeFilter)
      .pipe(indicate(this.loadingSecurities$));
    this.getTotalCount(activeFilter);
  }
  get currentPageIndex(): number {
    return Math.floor(this.filter?.skip / this.filter?.limit);
  }
  getTotalCount(activeFilter: any) {
    // This logic is not needed if total count sent by server
    const { skip, limit, ...countFilter } = activeFilter;
    this._securityService
      .getSecurities(countFilter)
      .pipe(indicate(this.loadingSecurities$))
      .subscribe((data) => {
        this.totalCount = data?.length;
        this.pageSizeOptions = this.buildPageSizeOptions();
        // Reset paginator if total items less than current page
        if (this.pagination) {
          const maxPageIndex = Math.floor(
            (this.totalCount - 1) / this.filter?.limit
          );
          if (this.pagination?.pageIndex > maxPageIndex) {
            this.pagination.pageIndex = 0;
            this.filter.skip = 0;
            this.getSecuritiesList(this.filter);
          }
        }
      });
  }

  buildPageSizeOptions() {
    let pageSizeOptions = [10];
    if (this.totalCount >= 20) {
      pageSizeOptions.push(20);
    }
    if (this.totalCount >= 50) {
      pageSizeOptions.push(50);
    }
    if (this.totalCount >= 100) {
      pageSizeOptions.push(100);
    }
    return pageSizeOptions;
  }
}
