import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioSelectComponent } from './radio-select.component';

describe('RadioSelectComponent', () => {
  let component: RadioSelectComponent;
  let fixture: ComponentFixture<RadioSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
