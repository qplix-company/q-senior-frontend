import { BehaviorSubject } from 'rxjs';
import { PagingFilter, SecuritiesFilter } from '../models/securities-filter';
import { PAGE_SIZE } from '../constants/form';

export interface FilterContextParams {
  filters: SecuritiesFilter;
  pagination: PagingFilter;
}

export const filtersContext = new BehaviorSubject<FilterContextParams>({
  filters: {},
  pagination: { skip: 0, limit: PAGE_SIZE },
});
