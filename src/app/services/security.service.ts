import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mock';
import { SecuritiesFilter } from '../models/securitiesFilter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor() {}

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
