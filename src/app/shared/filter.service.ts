import { Injectable } from '@angular/core';
import { Security } from '../models/security';
import { FilterField } from '../models/filter-config';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
buildFilterFieldsFromSecurities(securities: Security[]): FilterField<any>[] {
    const uniqueTypes = Array.from(new Set(securities.map(s => s.type))).map(
      t => ({ label: t, value: t })
    );
    const uniqueCurrencies = Array.from(new Set(securities.map(s => s.currency))).map(
      c => ({ label: c, value: c })
    );

    return [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'types', label: 'Types', type: 'multiselect', options: uniqueTypes },
      { key: 'currencies', label: 'Currencies', type: 'multiselect', options: uniqueCurrencies },
      { key: 'isPrivate', label: 'Private', type: 'checkbox' },
    ];
  }
}
