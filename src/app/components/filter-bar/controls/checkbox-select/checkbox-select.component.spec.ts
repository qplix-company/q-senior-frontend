import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { CheckboxSelectComponent } from './checkbox-select.component';

@Component({
  selector: 'app-filter-title',
  template: '',
})
class MockFilterTitleComponent {
  @Input() title!: any;
}

describe('CheckboxSelectComponent', () => {
  let component: CheckboxSelectComponent;
  let fixture: ComponentFixture<CheckboxSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxSelectComponent, MockFilterTitleComponent],
      imports: [ReactiveFormsModule, FormsModule, MatCheckboxModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxSelectComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
  });

  it('should create', () => {
    component.filter = {
      controlType: '',
      key: 'someKey',
      order: 0,
      options: [{ key: 'EUR', value: '€ Euro' }],
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display one checkboxes and one title', () => {
    component.filter = {
      controlType: '',
      key: 'someKey',
      name: 'Fancy title',
      order: 0,
      options: [{ key: 'EUR', value: '€ Euro' }],
    };
    fixture.detectChanges();

    const titleElement = fixture.debugElement.queryAll(
      By.css('app-filter-title')
    ).length;
    expect(titleElement).toBe(1);

    const checkBoxCount = fixture.debugElement.queryAll(
      By.css('mat-checkbox')
    ).length;
    expect(checkBoxCount).toBe(1);
  });

  it('should display two checkboxes and no title', () => {
    component.filter = {
      controlType: '',
      key: 'someKey',
      order: 0,
      options: [
        { key: 'EUR', value: '€ Euro' },
        { key: 'GBP', value: 'Sterling' },
      ],
    };
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('app-filter-title'));
    expect(titleElement).toBeFalsy();

    const checkBoxCount = fixture.debugElement.queryAll(
      By.css('mat-checkbox')
    ).length;
    expect(checkBoxCount).toBe(2);
  });
});
