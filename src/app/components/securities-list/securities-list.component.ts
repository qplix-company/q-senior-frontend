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
import { Observable, BehaviorSubject, of } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    CommonModule,
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
    PaginationComponent,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  @ViewChild(PaginationComponent) paginator!: PaginationComponent;
  protected displayedColumns: string[] = ['name', 'type', 'currency'];
  filter: any = { skip: 0, limit: 5 };
  totalCount = 0;
  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  protected securities$: Observable<Security[]> = of([]);
  pageSizeOptions: number[] = [5];

  ngOnInit() {
    this.getSecuritiesList({ ...this.filter, isPrivate: true });
  }
  onFilterChanged(event: any) {
    //reset to 1st after every filter change
    this.filter.skip = 0;
    this.filter.limit = 5;
    this.filter = { ...this.filter, ...event };
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getSecuritiesList(this.filter);
  }

  onPageChange(event: { skip: number; limit: number }) {
    this.filter.skip = event?.skip;
    this.filter.limit = event?.limit;
    this.getSecuritiesList({
      ...this.filter,
      isPrivate:
        this.filter?.isPrivate == undefined || this.filter?.isPrivate
          ? true
          : false,
    });
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
        if (this.paginator) {
          const maxPageIndex = Math.floor(
            (this.totalCount - 1) / this.filter?.limit
          );
          if (this.paginator?.pageIndex > maxPageIndex) {
            this.paginator.pageIndex = 0;
            this.filter.skip = 0;
            this.getSecuritiesList(this.filter); 
          }
        }
      });
  }

  buildPageSizeOptions() {
    let pageSizeOptions = [5];
    if(this.totalCount >= 10){
      pageSizeOptions.push(10)
    }
    if(this.totalCount >= 20) {
      pageSizeOptions.push(20)
    }
    if(this.totalCount >= 50) {
      pageSizeOptions.push(50)
    }
  return pageSizeOptions;
  }
}
