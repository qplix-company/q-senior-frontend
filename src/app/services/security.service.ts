import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';
import { getLocalCache, setLocalCache } from '../helpers/localStorageHelper';
import { CACHE_KEY_PREFIX, CACHE_TIME_TO_LIVE_MS } from '../constants/form';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities(
    securityFilter?: SecuritiesFilter
  ): Observable<{ data: Security[]; total: number }> {
    const cacheKey = this._createCacheKey(securityFilter);
    const cached = getLocalCache<{ data: Security[]; total: number }>(cacheKey);

    const skip = securityFilter?.skip ?? 0;
    const limit = securityFilter?.limit ?? 100;

    if (cached) {
      return of(cached).pipe(delay(1000));
    }

    const filtered = this._filterSecurities(securityFilter);
    const filteredSecurities = filtered.slice(skip, skip + limit);

    const cacheValue = {
      data: filteredSecurities,
      total: filtered.length,
    };

    setLocalCache(cacheKey, cacheValue, {
      timeToLiveMs: CACHE_TIME_TO_LIVE_MS,
    });

    return of(cacheValue).pipe(delay(1000));
  }

  private _filterSecurities(
    securityFilter: SecuritiesFilter | undefined
  ): Security[] {
    if (!securityFilter) return SECURITIES;

    return SECURITIES.filter(
      (s) =>
        (!securityFilter.name || s.name.includes(securityFilter.name)) &&
        (!securityFilter.types ||
          securityFilter.types.length === 0 ||
          securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies ||
          securityFilter.currencies.length === 0 ||
          securityFilter.currencies.some(
            (currency) => s.currency == currency
          )) &&
        (securityFilter.isPrivate === undefined ||
          securityFilter.isPrivate === s.isPrivate)
    );
  }

  private _createCacheKey(filter?: SecuritiesFilter): string {
    if (!filter) return CACHE_KEY_PREFIX + 'default';

    const cleaned = { ...filter };
    const { skip, limit } = cleaned;
    delete cleaned.skip;
    delete cleaned.limit;

    return `${CACHE_KEY_PREFIX}${JSON.stringify(cleaned)}:skip=${
      skip ?? 0
    }:limit=${limit ?? 100}`;
  }
}
