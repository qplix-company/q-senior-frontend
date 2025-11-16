import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, take } from 'rxjs';
import { Security } from '../../models/security';
import { SECURITIES } from '../../mocks/securities-mocks';
import { SecurityService } from '../../services/security.service';
import { SecuritiesListComponent } from './securities-list.component';
import { SecuritiesFilter } from '../../models/securities-filter';

const MOCK_SECURITY: Security = {
  id: '1',
  name: 'Alpha',
  type: 'Equity',
  currency: 'EUR',
  isPrivate: false,
};

describe('SecuritiesListComponent', () => {
  let fixture: ComponentFixture<SecuritiesListComponent>;
  let component: SecuritiesListComponent;
  let securityService: jasmine.SpyObj<SecurityService>;

  beforeEach(async () => {
    securityService = jasmine.createSpyObj<SecurityService>('SecurityService', ['getSecurities', 'countSecurities']);
    securityService.getSecurities.and.returnValue(of([MOCK_SECURITY]));
    securityService.countSecurities.and.returnValue(of(1));

    await TestBed.configureTestingModule({
      imports: [SecuritiesListComponent, NoopAnimationsModule],
      providers: [{ provide: SecurityService, useValue: securityService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SecuritiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('builds the filter fields from the securities dataset on init', () => {
    const expectedTypes = Array.from(new Set(SECURITIES.map((s) => s.type))).sort();
    const expectedCurrencies = Array.from(new Set(SECURITIES.map((s) => s.currency))).sort();

    const typesField = component.fields.find((f) => f.key === 'types');
    const currenciesField = component.fields.find((f) => f.key === 'currencies');

    expect(typesField?.options).toEqual(expectedTypes);
    expect(currenciesField?.options).toEqual(expectedCurrencies);
  });

  it('resets paging and pushes a new filter when the filter changes', () => {
    component['securities$'].pipe(take(1)).subscribe();
    component['totalCount$'].pipe(take(1)).subscribe();
    securityService.getSecurities.calls.reset();
    securityService.countSecurities.calls.reset();

    const pageEvent: PageEvent = {
      pageIndex: 2,
      pageSize: 25,
      length: 100,
      previousPageIndex: 1,
    };
    component.onPage(pageEvent);

    expect(component['pageIndex']).toBe(2);
    expect(component['pageSize']).toBe(25);
    expect(securityService.getSecurities).toHaveBeenCalledWith(jasmine.objectContaining({ skip: 50, limit: 25 }));
    expect(securityService.countSecurities).toHaveBeenCalledWith(jasmine.objectContaining({ skip: 50, limit: 25 }));

    securityService.getSecurities.calls.reset();
    securityService.countSecurities.calls.reset();
    component.onFilterChange({ name: 'Loan' });

    expect(component['pageIndex']).toBe(0);
    expect(securityService.getSecurities).toHaveBeenCalledWith({
      name: 'Loan',
      skip: 0,
      limit: 25,
    });
    expect(securityService.countSecurities).toHaveBeenCalledWith({
      name: 'Loan',
      skip: 0,
      limit: 25,
    });
  });

  it('falls back to an empty filter when onFilterChange receives a nullish value', () => {
    component['securities$'].pipe(take(1)).subscribe();
    component['totalCount$'].pipe(take(1)).subscribe();

    component.onFilterChange({ name: 'Alpha' });
    securityService.getSecurities.calls.reset();
    securityService.countSecurities.calls.reset();

    component.onFilterChange(undefined as unknown as Partial<SecuritiesFilter>);

    expect(component['pageIndex']).toBe(0);
    expect(securityService.getSecurities).toHaveBeenCalledWith({
      skip: 0,
      limit: 10,
    });
    expect(securityService.countSecurities).toHaveBeenCalledWith({
      skip: 0,
      limit: 10,
    });
  });
});
