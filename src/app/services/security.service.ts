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
    const skip = securityFilter?.skip ?? 0;
    const limit = securityFilter?.limit ?? 100;
    const end = skip + limit;
    const filteredSecurities = this._filterSecurities(securityFilter).slice(
      skip,
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
        (!securityFilter.types ||
          securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies ||
          securityFilter.currencies.some(
            (currency) => s.currency == currency
          )) &&
        (securityFilter.isPrivate === undefined ||
          securityFilter.isPrivate === s.isPrivate)
    );
  }

  countSecurities(securityFilter?: SecuritiesFilter): Observable<number> {
    const count = this._filterSecurities(securityFilter).length;
    return of(count).pipe(delay(300));
  }
}
