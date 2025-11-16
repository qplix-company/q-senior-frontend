import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityService],
    });
    service = TestBed.inject(SecurityService);
  });

  it('applies paging arguments when fetching data', fakeAsync(() => {
    const skip = 5;
    const limit = 3;
    let result: Security[] = [];

    service.getSecurities({ skip, limit }).subscribe((value) => (result = value));
    tick(1000);

    expect(result.length).toBe(limit);
    expect(result[0].id).toBe(SECURITIES[skip].id);
  }));

  it('filters by the provided criteria', fakeAsync(() => {
    const target = SECURITIES.find((s) => !s.isPrivate) as Security;
    let result: Security[] = [];

    service
      .getSecurities({
        name: target.name,
        types: [target.type],
        currencies: [target.currency],
        isPrivate: target.isPrivate,
      })
      .subscribe((value) => (result = value));
    tick(1000);

    expect(result).toEqual([target]);
  }));

  it('returns a filtered count', fakeAsync(() => {
    const expected = SECURITIES.filter((s) => s.currency === 'EUR').length;
    let count = 0;

    service
      .countSecurities({
        currencies: ['EUR'],
      })
      .subscribe((value) => (count = value));
    tick(300);

    expect(count).toBe(expected);
  }));
});
