import { Injectable } from '@angular/core';
import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mock';
import { SecuritiesFilter } from '../models/securitiesFilter';
import { FilterDefinition, FilterType } from '../models/filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const filteredSecurities = this.filterSecurities(securityFilter).slice(
      securityFilter?.skip ?? 0,
      securityFilter?.limit ?? 100,
    );

    return of(filteredSecurities).pipe(delay(1000));
  }

  async getFilterdefinitions(): Promise<FilterDefinition[]> {
    const securityTypes = await this.getSecurityTypes();
    const securityCurrencies = await this.getSecurityCurrencies();
    return [
      {
        label: 'Name',
        type: FilterType.input,
        filterKey: 'name',
      },
      {
        label: 'Type',
        type: FilterType.selectMultiple,
        filterKey: 'types',
        options: securityTypes,
      },
      {
        label: 'Currency',
        type: FilterType.selectMultiple,
        filterKey: 'currencies',
        options: securityCurrencies,
      },
      {
        label: 'is Private',
        type: FilterType.checkbox,
        filterKey: 'isPrivate',
      },
    ];
  }

  private getSecurityTypes(): Promise<string[]> {
    const securityTypes: Set<string> = new Set();

    SECURITIES.map((security: Security) => securityTypes.add(security.type));
    return lastValueFrom(of(Array.from(securityTypes).sort()).pipe(delay(1000)));
  }

  private getSecurityCurrencies(): Promise<string[]> {
    const securityCurrencies: Set<string> = new Set();

    SECURITIES.map((security: Security) => securityCurrencies.add(security.currency));
    return lastValueFrom(of(Array.from(securityCurrencies).sort()).pipe(delay(1000)));
  }

  private filterSecurities(securityFilter: SecuritiesFilter) {
    if (!securityFilter) return SECURITIES;

    return SECURITIES.filter(
      (s) =>
        (!securityFilter.name || s.name.includes(securityFilter.name)) &&
        (!securityFilter.types || securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies || securityFilter.currencies.some((currency) => s.currency == currency)) &&
        (securityFilter.isPrivate === undefined || securityFilter.isPrivate === s.isPrivate),
    );
  }
}
