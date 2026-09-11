import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormGroup } from '@angular/forms';
import { FilterBarComponent } from './filter-bar.component';
import { FilterFieldConfig, FilterValue } from '../../models/filter-field';
import { SECURITY_CURRENCIES, SECURITY_TYPES } from '../../../mocks/securities-mocks';

const formOf = (component: FilterBarComponent): FormGroup =>
  (component as unknown as { form: FormGroup }).form;

const FIELDS: FilterFieldConfig[] = [
  { key: 'search', label: 'Search', type: 'text', minLength: 3 },
  {
    key: 'types',
    label: 'Types',
    type: 'multi-select',
    options: SECURITY_TYPES.map((type) => ({ label: type, value: type })),
  },
  {
    key: 'currencies',
    label: 'Currencies',
    type: 'multi-select',
    options: SECURITY_CURRENCIES.map((currency) => ({ label: currency, value: currency })),
  },
  { key: 'active', label: 'Active', type: 'boolean' },
];

@Component({
  standalone: true,
  imports: [FilterBarComponent],
  template: `<app-filter-bar [fields]="fields" (filterChange)="onFilterChange($event)"></app-filter-bar>`,
})
class HostComponent {
  fields: FilterFieldConfig[] = FIELDS;
  emitted: FilterValue[] = [];

  onFilterChange(value: FilterValue): void {
    this.emitted.push(value);
  }
}

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let filterBar: FilterBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    filterBar = fixture.debugElement.query(By.directive(FilterBarComponent)).componentInstance;
  });

  it('builds the configured form controls without learning field meaning', () => {
    expect(Object.keys(formOf(filterBar).controls)).toEqual(['search', 'types', 'currencies', 'active']);
  });

  it('emits the normalized filter object only after the debounce window finishes', fakeAsync(() => {
    formOf(filterBar).get('search')!.setValue('AAPL');

    tick(299);
    expect(host.emitted.length).toBe(0);

    tick(1);
    expect(host.emitted).toEqual([{ search: 'AAPL' }]);
  }));

  it('removes empty strings, empty arrays and null values before sending the payload', fakeAsync(() => {
    formOf(filterBar).setValue({ search: '  ', types: [], currencies: [], active: null });
    tick(300);

    expect(host.emitted).toEqual([{}]);
  }));

  it('retains an explicit boolean false in the emitted payload', fakeAsync(() => {
    formOf(filterBar).get('active')!.setValue(false);
    tick(300);

    expect(host.emitted).toEqual([{ active: false }]);
  }));

  it('skips a duplicate emission when the form value does not meaningfully change', fakeAsync(() => {
    formOf(filterBar).get('types')!.setValue(['Equity']);
    tick(300);
    formOf(filterBar).get('types')!.setValue(['Equity']);
    tick(300);

    expect(host.emitted.length).toBe(1);
  }));

  it('rebuilds the control set when the field configuration changes', () => {
    host.fields = [{ key: 'unrelatedKey', label: 'Unrelated', type: 'text' }];
    fixture.detectChanges();

    expect(Object.keys(formOf(filterBar).controls)).toEqual(['unrelatedKey']);
  });

  it('withholds a text payload until the configured minimum length is reached', fakeAsync(() => {
    formOf(filterBar).get('search')!.setValue('AA');
    tick(300);
    expect(host.emitted).toEqual([]);

    formOf(filterBar).get('search')!.setValue('AAP');
    tick(300);
    expect(host.emitted).toEqual([{ search: 'AAP' }]);
  }));

  it('shows a per-field clear icon only after the field has visible content', fakeAsync(() => {
    const clearButton = () =>
      fixture.debugElement.query(By.css('button[aria-label="Clear Search"]'));

    expect(clearButton()).toBeNull();

    formOf(filterBar).get('search')!.setValue('AAPL');
    fixture.detectChanges();
    tick(300);

    expect(clearButton()).not.toBeNull();

    clearButton().nativeElement.click();
    fixture.detectChanges();
    tick(300);

    expect(formOf(filterBar).get('search')!.value).toBe('');
    expect(host.emitted[host.emitted.length - 1]).toEqual({});
  }));

  it('clears every control in one action and emits the empty filter object', fakeAsync(() => {
    formOf(filterBar).get('search')!.setValue('AAPL');
    formOf(filterBar).get('types')!.setValue(['Equity']);
    tick(300);

    fixture.debugElement.query(By.css('.filter-bar__clear-all')).nativeElement.click();
    tick(300);

    expect(formOf(filterBar).value).toEqual({ search: '', types: [], currencies: [], active: null });
    expect(host.emitted[host.emitted.length - 1]).toEqual({});
  }));
});
