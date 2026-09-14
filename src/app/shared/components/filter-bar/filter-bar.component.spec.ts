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

  it('builds one control per configured field', () => {
    expect(Object.keys(formOf(filterBar).controls)).toEqual(['search', 'types', 'currencies', 'active']);
  });

  it('rebuilds the controls when the field list changes', () => {
    host.fields = [{ key: 'unrelatedKey', label: 'Unrelated', type: 'text' }];
    fixture.detectChanges();

    expect(Object.keys(formOf(filterBar).controls)).toEqual(['unrelatedKey']);
  });

  it('debounces emissions by 300ms', fakeAsync(() => {
    formOf(filterBar).get('search')!.setValue('AAPL');

    tick(299);
    expect(host.emitted.length).toBe(0);

    tick(1);
    expect(host.emitted).toEqual([{ search: 'AAPL' }]);
  }));

  it('skips a change if the value did not actually change', fakeAsync(() => {
    formOf(filterBar).get('types')!.setValue(['Equity']);
    tick(300);
    formOf(filterBar).get('types')!.setValue(['Equity']);
    tick(300);

    expect(host.emitted.length).toBe(1);
  }));

  it('strips empty and null values but keeps an explicit false', fakeAsync(() => {
    formOf(filterBar).setValue({ search: '  ', types: [], currencies: [], active: false });
    tick(300);

    expect(host.emitted).toEqual([{ active: false }]);
  }));

  it('withholds text below the configured minimum length', fakeAsync(() => {
    formOf(filterBar).get('search')!.setValue('AA');
    tick(300);
    expect(host.emitted).toEqual([]);

    formOf(filterBar).get('search')!.setValue('AAP');
    tick(300);
    expect(host.emitted).toEqual([{ search: 'AAP' }]);
  }));

  it('shows the clear icon once a field has a value, and clears it on click', fakeAsync(() => {
    const clearButton = () => fixture.debugElement.query(By.css('button[aria-label="Clear Search"]'));

    expect(clearButton()).toBeNull();

    formOf(filterBar).get('search')!.setValue('AAPL');
    fixture.detectChanges();
    tick(300);
    expect(clearButton()).not.toBeNull();

    clearButton().nativeElement.click();
    fixture.detectChanges();
    tick(300);

    expect(formOf(filterBar).get('search')!.value).toBe('');
    expect(host.emitted.at(-1)).toEqual({});
  }));

  it('clears every control and emits an empty filter', fakeAsync(() => {
    formOf(filterBar).get('search')!.setValue('AAPL');
    formOf(filterBar).get('types')!.setValue(['Equity']);
    tick(300);

    fixture.debugElement.query(By.css('.filter-bar__clear-all')).nativeElement.click();
    tick(300);

    expect(formOf(filterBar).value).toEqual({ search: '', types: [], currencies: [], active: null });
    expect(host.emitted.at(-1)).toEqual({});
  }));
});
