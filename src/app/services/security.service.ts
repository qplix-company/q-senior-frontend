import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const start = securityFilter?.skip ?? 0;
    const end = start + (securityFilter?.limit ?? 100);
    const filteredSecurities = this._filterSecurities(securityFilter).slice(
      start,
      end
    );

    return of(filteredSecurities).pipe(delay(1000));
  }

  private _filterSecurities(
    securityFilter: SecuritiesFilter | undefined
  ): Security[] {
    if (!securityFilter) return SECURITIES;

    return SECURITIES.filter(
      (s) =>
        (!securityFilter.name ||
          s.name.toLowerCase().includes(securityFilter.name.toLowerCase())) &&
        (!securityFilter.types?.length ||
          securityFilter.types.some(
            (type) => s.type.toLowerCase() === type.toLowerCase()
          )) &&
        (!securityFilter.currencies?.length ||
          securityFilter.currencies.some(
            (currency) => s.currency.toLowerCase() == currency.toLowerCase()
          )) &&
        (securityFilter.isPrivate === undefined ||
          securityFilter.isPrivate === s.isPrivate)
    );
  }
}
