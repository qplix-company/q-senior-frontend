import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task2Component } from './task2.component';

describe('Task2Component', () => {
  let fixture: ComponentFixture<Task2Component>;
  let component: Task2Component;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Task2Component);
    component = fixture.componentInstance;
  });

  it('selects every row when selectAll is invoked', () => {
    component.selectAll();
    const rows = component.rows();
    expect(component.isSelected(rows[0])).toBeTrue();
    expect(component.isSelected(rows[rows.length - 1])).toBeTrue();
  });

  it('clears the selection when deselectAll is invoked', () => {
    component.selectAll();
    component.deselectAll();
    expect(component.isSelected(component.rows()[0])).toBeFalse();
  });

  it('toggles an individual row selection', () => {
    const row = component.rows()[10];
    component.toggle(row);
    expect(component.isSelected(row)).toBeTrue();
    component.toggle(row);
    expect(component.isSelected(row)).toBeFalse();
  });

  it('retains the selection state after recreating the data', () => {
    const initialRow = component.rows()[0];
    component.toggle(initialRow);
    component.recreateData();
    const recreatedRow = component.rows()[0];
    expect(recreatedRow.id).toBe(initialRow.id);
    expect(component.isSelected(recreatedRow)).toBeTrue();
  });
});
