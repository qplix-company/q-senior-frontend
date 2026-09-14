import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import {
  SECURITIES,
  SECURITY_CURRENCIES,
  SECURITY_TYPES,
} from '../mocks/securities-mocks';
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
    const filteredSecurities = this.filterSecurities(securityFilter).slice(
      skip,
      skip + limit
    );

    return of(filteredSecurities).pipe(delay(1000));
  }

  /** Total count of securities matching `securityFilter`, ignoring paging (`skip`/`limit`). */
  getSecuritiesCount(securityFilter?: SecuritiesFilter): Observable<number> {
    return of(this.filterSecurities(securityFilter).length).pipe(delay(1000));
  }

  getCurrencies(): Observable<string[]> {
    return of([...SECURITY_CURRENCIES]);
  }

  getSecurityTypes(): Observable<string[]> {
    return of([...SECURITY_TYPES]);
  }

  private filterSecurities(
    securityFilter: SecuritiesFilter | undefined
  ): Security[] {
    if (!securityFilter) return SECURITIES;

    const name = securityFilter.name?.toLowerCase();

    return SECURITIES.filter(
      (s) =>
        (!name || s.name.toLowerCase().includes(name)) &&
        (!securityFilter.types ||
          securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies ||
          securityFilter.currencies.some(
            (currency) => s.currency === currency
          )) &&
        (securityFilter.isPrivate === undefined ||
          securityFilter.isPrivate === s.isPrivate)
    );
  }
}
