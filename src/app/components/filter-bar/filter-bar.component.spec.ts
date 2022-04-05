import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { FilterControlBase } from './controls/filter-controls-base';
import { FilterControlsOptions } from './controls/filter-controls-options';
import { FilterBarComponent } from './filter-bar.component';

@Component({
  selector: 'app-checkbox-select',
  template: '',
})
class MockCheckboxSelectComponent {
  @Input() filter!: any;
  @Input() form!: any;
}

@Component({
  selector: 'app-radio-select',
  template: '',
})
class MockRadioSelectComponent {
  @Input() filter!: any;
  @Input() form!: any;
}

@Component({
  selector: 'app-search-field',
  template: '',
})
class MockSearchFieldComponent {
  @Input() filter!: any;
  @Input() form!: any;
}

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FilterBarComponent,
        MockCheckboxSelectComponent,
        MockRadioSelectComponent,
        MockSearchFieldComponent,
      ],
      imports: [FormsModule, ReactiveFormsModule, MatProgressSpinnerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner instead of form, while loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const spinnerElement = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinnerElement).toBeTruthy();

    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeNull();
  });

  it('should display loading of form after loading', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const spinnerElement = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinnerElement).toBeNull();

    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should display form searchField component', () => {
    component.isLoading = false;
    component.filterData = [
      {
        controlType: 'searchField',
        key: 'someKey',
        order: 0,
      },
    ];
    component.ngOnChanges();
    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('app-search-field')
    );
    expect(searchElement).toBeTruthy();
  });

  it('should display form radio select component', () => {
    component.isLoading = false;
    let tmp: FilterControlsOptions = {
      controlType: 'radioSelect',
      key: 'someKey',
      order: 0,
      options: [{ key: '', value: 'All' }],
    };

    component.filterData = [tmp as FilterControlBase];
    component.ngOnChanges();
    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('app-radio-select')
    );
    expect(searchElement).toBeTruthy();
  });

  it('should display form checkbox select component', () => {
    component.isLoading = false;
    component.filterData = [
      {
        controlType: 'checkBoxSelect',
        key: 'someKey',
        order: 0,
      },
    ];
    component.ngOnChanges();
    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('app-checkbox-select')
    );
    expect(searchElement).toBeTruthy();
  });

  it('should display form components in the correct order', () => {
    component.isLoading = false;
    component.filterData = [
      {
        controlType: 'radioSelect',
        key: 'otherKey',
        order: 2,
      },
      {
        controlType: 'checkBoxSelect',
        key: 'someKey',
        order: 0,
      },
      {
        controlType: 'searchField',
        key: 'foreignKey',
        order: 1,
      },
    ];
    component.ngOnChanges();
    fixture.detectChanges();

    const children = fixture.debugElement.queryAll(By.css('form div div *'));
    expect(children[0].name).toBe('app-checkbox-select');
    expect(children[1].name).toBe('app-search-field');
    expect(children[2].name).toBe('app-radio-select');
  });
});
