import { Injectable } from '@angular/core';
import { FilterConfig } from '../models/filter-config';
import { Security } from '../models/security';

@Injectable({
  providedIn: 'root',
})
export class FilterationService {
  constructor() {}

  buildFilterFieldsFromSecurities(securities: Security[]): FilterConfig<any>[] {
    const uniqueTypes = Array.from(new Set(securities.map((s) => s.type))).map(
      (t) => ({ label: t, value: t })
    );
    const uniqueCurrencies = Array.from(
      new Set(securities.map((s) => s.currency))
    ).map((c) => ({ label: c, value: c }));

    return [
      { key: 'name', label: 'Name', type: 'text' },
      {
        key: 'types',
        label: 'Types',
        type: 'multiselect',
        options: uniqueTypes,
      },
      {
        key: 'currencies',
        label: 'Currencies',
        type: 'multiselect',
        options: uniqueCurrencies,
      },
      { key: 'isPrivate', label: 'Private', type: 'checkbox' },
    ];
  }
}
