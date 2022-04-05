import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterTitleComponent } from './filter-title.component';

describe('FilterTitleComponent', () => {
  let component: FilterTitleComponent;
  let fixture: ComponentFixture<FilterTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTitleComponent);
    component = fixture.componentInstance;
    component.title = 'Fancy title';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title from input', () => {
    expect(fixture.nativeElement.querySelector('div').innerText).toEqual(
      'Fancy title'
    );
  });
});
