import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { By } from '@angular/platform-browser';
import { RadioSelectComponent } from './radio-select.component';

@Component({
  selector: 'app-filter-title',
  template: '',
})
class MockFilterTitleComponent {
  @Input() title!: any;
}

describe('RadioSelectComponent', () => {
  let component: RadioSelectComponent;
  let fixture: ComponentFixture<RadioSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioSelectComponent, MockFilterTitleComponent],
      imports: [ReactiveFormsModule, FormsModule, MatRadioModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioSelectComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      someKey: new FormControl({}),
    });
  });

  it('should create', () => {
    component.filter = component.filter = {
      controlType: '',
      key: 'someKey',
      order: 0,
      options: [{ key: '', value: 'All' }],
    };
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display one radiobox and one title', () => {
    component.filter = component.filter = {
      controlType: '',
      key: 'someKey',
      name: 'Title text',
      order: 0,
      options: [{ key: '', value: 'something' }],
    };
    fixture.detectChanges();

    const titleElement = fixture.debugElement.queryAll(
      By.css('app-filter-title')
    ).length;
    expect(titleElement).toBe(1);

    const radioCount = fixture.debugElement.queryAll(
      By.css('mat-radio-button')
    ).length;
    expect(radioCount).toBe(1);
  });

  it('should display three radiobox and no title', () => {
    component.filter = component.filter = {
      controlType: '',
      key: 'someKey',
      order: 0,
      options: [
        { key: '', value: 'All' },
        { key: 'true', value: 'Private' },
        { key: 'false', value: 'Non private' },
      ],
    };
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('app-filter-title'));
    expect(titleElement).toBeNull();

    const radioCount = fixture.debugElement.queryAll(
      By.css('mat-radio-button')
    ).length;
    expect(radioCount).toBe(3);
  });
});
