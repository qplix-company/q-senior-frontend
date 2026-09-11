import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SecurityService } from './security.service';
import { SECURITIES, SECURITY_CURRENCIES, SECURITY_TYPES } from '../mocks/securities-mocks';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityService);
  });

  it('returns the requested first page from the mock dataset using skip and limit semantics', fakeAsync(() => {
    let result: unknown[] = [];
    service.getSecurities({ skip: 0, limit: 10 }).subscribe((items) => (result = items));
    tick(1000);

    expect(result.length).toBe(10);
    expect(result).toEqual(SECURITIES.slice(0, 10));
  }));

  it('returns a later page using skip as an offset instead of treating limit as a slice endpoint', fakeAsync(() => {
    let result: unknown[] = [];
    service.getSecurities({ skip: 10, limit: 10 }).subscribe((items) => (result = items));
    tick(1000);

    expect(result.length).toBe(10);
    expect(result).toEqual(SECURITIES.slice(10, 20));
    expect(result.length).not.toBe(0);
  }));

  it('returns the remaining rows without erroring when the requested page reaches the end of the dataset', fakeAsync(() => {
    const total = SECURITIES.length;
    let result: unknown[] = [];
    service.getSecurities({ skip: total - 5, limit: 10 }).subscribe((items) => (result = items));
    tick(1000);

    expect(result.length).toBe(5);
  }));

  it('returns the correct total count for a currency filter, matching the mock data contract', fakeAsync(() => {
    const currency = SECURITIES[0].currency;
    const expectedCount = SECURITIES.filter((s) => s.currency === currency).length;

    let count!: number;
    service.getSecuritiesCount({ currencies: [currency] }).subscribe((value) => (count = value));
    tick(1000);

    expect(count).toBe(expectedCount);
  }));

  it('exposes the supported security currencies from the shared mock metadata source', fakeAsync(() => {
    let currencies: string[] = [];

    service.getCurrencies().subscribe((items) => (currencies = items));
    tick(0);

    expect(currencies).toEqual(SECURITY_CURRENCIES);
  }));

  it('exposes the supported security types from the shared mock metadata source', fakeAsync(() => {
    let types: string[] = [];

    service.getSecurityTypes().subscribe((items) => (types = items));
    tick(0);

    expect(types).toEqual(SECURITY_TYPES);
  }));

  it('matches the name filter case-insensitively, as the server-side contract expects', fakeAsync(() => {
    const sample = SECURITIES.find((s) => /[a-z]/.test(s.name) && /[A-Z]/.test(s.name))!;
    const needle = sample.name.slice(0, 5);
    const invertedCaseNeedle = Array.from(needle)
      .map((ch) => (ch === ch.toLowerCase() ? ch.toUpperCase() : ch.toLowerCase()))
      .join('');
    const expected = SECURITIES.filter((s) =>
      s.name.toLowerCase().includes(needle.toLowerCase())
    );

    let result: unknown[] = [];
    service
      .getSecurities({ name: invertedCaseNeedle, limit: SECURITIES.length })
      .subscribe((items) => (result = items));
    tick(1000);

    expect(result.length).toBeGreaterThan(0);
    expect(result).toEqual(expected);
  }));
});
