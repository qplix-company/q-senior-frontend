import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterBarComponent } from './filter-bar.component';
import { FilterField } from '../../models/filter-definition';

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<FilterBarComponent>;
  let component: FilterBarComponent;
  let emissions: any[];

  const baseFields: FilterField[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'types', label: 'Types', type: 'multiselect', options: ['Loan', 'Equity'] },
    { key: 'isPrivate', label: 'Private', type: 'boolean' },
    { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    emissions = [];
    component.filterChange.subscribe((value) => emissions.push(value));
    component.fields = [...baseFields];
    fixture.detectChanges();
  });

  it('builds controls with sensible defaults and emits cleaned initial filter', () => {
    expect(component.form.value).toEqual({
      name: '',
      types: [],
      isPrivate: false,
      status: null,
    });
    expect(emissions[0]).toEqual({ isPrivate: false });
  });

  it('emits cleaned values on submit, ignoring empty strings and arrays', () => {
    emissions.length = 0;
    component.form.patchValue({
      name: '  ',
      types: ['Equity'],
      isPrivate: false,
      status: 'active',
    });
    component.onSubmit();

    expect(emissions[0]).toEqual({
      types: ['Equity'],
      isPrivate: false,
      status: 'active',
    });
  });

  it('resets controls and emits cleaned defaults on reset', () => {
    component.form.patchValue({
      name: 'Loan',
      types: ['Loan'],
      isPrivate: true,
      status: 'active',
    });

    component.onReset();

    expect(component.form.value).toEqual({
      name: '',
      types: [],
      isPrivate: false,
      status: null,
    });
    expect(emissions.at(-1)).toEqual({ isPrivate: false });
  });

  it('rebuilds the form when fields input changes', () => {
    emissions.length = 0;
    const updatedFields: FilterField[] = [
      { key: 'currency', label: 'Currency', type: 'select', options: [{ label: 'EUR', value: 'EUR' }], value: 'EUR' },
    ];
    component.fields = updatedFields;
    component.ngOnChanges({
      fields: new SimpleChange(baseFields, updatedFields, false),
    });

    expect(component.form.get('currency')?.value).toBe('EUR');
    expect(emissions[0]).toEqual({ currency: 'EUR' });
  });
});
