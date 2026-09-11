import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { delay, Observable, of, throwError } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SecuritiesListComponent } from './securities-list.component';
import { SecurityService } from '../../services/security.service';
import { Security } from '../../models/security';
import { FilterFieldConfig, FilterValue } from '../../shared/models/filter-field';

interface SecuritiesListInternals {
  onFilterChange(filter: FilterValue): void;
  onPageChange(event: PageEvent): void;
  totalCount$: Observable<number>;
  filterFields: FilterFieldConfig[];
}
const internals = (component: SecuritiesListComponent): SecuritiesListInternals =>
  component as unknown as SecuritiesListInternals;

describe('SecuritiesListComponent', () => {
  let fixture: ComponentFixture<SecuritiesListComponent>;
  let component: SecuritiesListComponent;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;

  const PAGE_SIZE = 25;
  const TOTAL_MATCHES = 69;

  const makeSecurities = (count: number): Security[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `${i}`,
      name: `Security ${i}`,
      type: 'Equity',
      currency: 'USD',
      isPrivate: false,
    }));

  beforeEach(async () => {
    securityServiceSpy = jasmine.createSpyObj('SecurityService', [
      'getSecurities',
      'getSecuritiesCount',
      'getSecurityTypes',
      'getCurrencies',
    ]);
    securityServiceSpy.getSecurities.and.returnValue(of(makeSecurities(PAGE_SIZE)));
    securityServiceSpy.getSecuritiesCount.and.returnValue(of(TOTAL_MATCHES));
    securityServiceSpy.getSecurityTypes.and.returnValue(of(['Equity', 'Bond']));
    securityServiceSpy.getCurrencies.and.returnValue(of(['USD', 'EUR']));

    await TestBed.configureTestingModule({
      imports: [SecuritiesListComponent],
      providers: [
        { provide: SecurityService, useValue: securityServiceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecuritiesListComponent);
    component = fixture.componentInstance;
  });

  it('asks the service for the first page when the component is created', () => {
    fixture.detectChanges();

    expect(securityServiceSpy.getSecurities).toHaveBeenCalledWith(
      jasmine.objectContaining({ skip: 0, limit: PAGE_SIZE })
    );
  });

  it('hydrates the type and currency fields from the service metadata accessors', () => {
    fixture.detectChanges();

    const typeField = internals(component).filterFields.find((field) => field.key === 'types');
    const currencyField = internals(component).filterFields.find((field) => field.key === 'currencies');

    expect(securityServiceSpy.getSecurityTypes).toHaveBeenCalled();
    expect(securityServiceSpy.getCurrencies).toHaveBeenCalled();
    expect(typeField?.options).toEqual([
      { label: 'Equity', value: 'Equity' },
      { label: 'Bond', value: 'Bond' },
    ]);
    expect(currencyField?.options).toEqual([
      { label: 'USD', value: 'USD' },
      { label: 'EUR', value: 'EUR' },
    ]);
  });

  it('turns the filter bar payload into a backend securities request and resets paging to the first page', () => {
    fixture.detectChanges();
    securityServiceSpy.getSecurities.calls.reset();

    internals(component).onFilterChange({ name: 'Apple', types: ['Equity'] });

    expect(securityServiceSpy.getSecurities).toHaveBeenCalledWith({
      name: 'Apple',
      types: ['Equity'],
      skip: 0,
      limit: PAGE_SIZE,
    });
  });

  it('maps a paginator event into the paging values sent to the service', () => {
    fixture.detectChanges();
    securityServiceSpy.getSecurities.calls.reset();

    internals(component).onPageChange({ pageIndex: 2, pageSize: 10, length: 100 } as PageEvent);

    expect(securityServiceSpy.getSecurities).toHaveBeenCalledWith(
      jasmine.objectContaining({ skip: 20, limit: 10 })
    );
  });

  it('resets paging to the first page when a new filter arrives after a user moved forward', () => {
    fixture.detectChanges();
    internals(component).onPageChange({ pageIndex: 2, pageSize: 10, length: 100 } as PageEvent);
    securityServiceSpy.getSecurities.calls.reset();

    internals(component).onFilterChange({ name: 'Apple' });

    expect(securityServiceSpy.getSecurities).toHaveBeenCalledWith(
      jasmine.objectContaining({ skip: 0 })
    );
  });

  it('reports the backend total match count to the paginator source', () => {
    fixture.detectChanges();

    let total!: number;
    internals(component).totalCount$.subscribe((value) => (total = value));

    expect(total).toBe(TOTAL_MATCHES);
    expect(securityServiceSpy.getSecuritiesCount).toHaveBeenCalledWith({});
  });

  it('re-queries the total count when the filter object changes', () => {
    fixture.detectChanges();
    securityServiceSpy.getSecuritiesCount.calls.reset();

    internals(component).onFilterChange({ name: 'Apple' });

    expect(securityServiceSpy.getSecuritiesCount).toHaveBeenCalledWith({ name: 'Apple' });
  });

  it('does not re-count when only the page state changes', () => {
    fixture.detectChanges();
    securityServiceSpy.getSecuritiesCount.calls.reset();

    internals(component).onPageChange({ pageIndex: 1, pageSize: PAGE_SIZE, length: 100 } as PageEvent);

    expect(securityServiceSpy.getSecuritiesCount).not.toHaveBeenCalled();
  });

  it('requires at least three characters before the name filter becomes active', () => {
    const nameField = internals(component).filterFields.find((field) => field.key === 'name');

    expect(nameField?.minLength).toBe(3);
  });

  it('shows a loading placeholder while the fetch is pending and restores the table once data returns', fakeAsync(() => {
    securityServiceSpy.getSecurities.and.returnValue(of(makeSecurities(PAGE_SIZE)).pipe(delay(1000)));
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('.securities-status--loading'));
    expect(loadingEl).not.toBeNull();
    expect(loadingEl.nativeElement.textContent).toContain('Loading securities');
    expect(fixture.debugElement.query(By.css('filterable-table'))).not.toBeNull();

    tick(1000);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.securities-status--loading'))).toBeNull();
    expect(fixture.debugElement.query(By.css('filterable-table'))).not.toBeNull();
  }));

  it('renders a friendly error message that carries the backend reason when the service fails', () => {
    securityServiceSpy.getSecurities.and.returnValue(throwError(() => new Error('Network down')));
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.securities-status--error'));
    expect(errorEl).not.toBeNull();
    expect(errorEl.nativeElement.textContent).toContain('Could not load securities');
    expect(errorEl.nativeElement.textContent).toContain('Network down');
    expect(fixture.debugElement.query(By.css('.securities-status--loading'))).toBeNull();
    expect(fixture.debugElement.query(By.css('filterable-table'))).not.toBeNull();
  });

  it('clears the previous error state after a later filter pass succeeds', () => {
    securityServiceSpy.getSecurities.and.returnValue(throwError(() => new Error('Network down')));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.securities-status--error'))).not.toBeNull();

    securityServiceSpy.getSecurities.and.returnValue(of(makeSecurities(PAGE_SIZE)));
    internals(component).onFilterChange({ name: 'Apple' });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.securities-status--error'))).toBeNull();
    expect(fixture.debugElement.query(By.css('filterable-table'))).not.toBeNull();
  });
});
