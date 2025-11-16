import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SimpleChange} from '@angular/core';
import {Task3Component} from './task3.component';

describe('Task3Component', () => {
  let fixture: ComponentFixture<Task3Component>;
  let component: Task3Component;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Task3Component);
    component = fixture.componentInstance;
  });

  it('computes derived metrics for the default data set', () => {
    expect(component.startingValue).toBe(28);
    expect(component.endingValue).toBe(45);
    expect(component.netChange).toBe(17);
    expect(component.growthPct).toBeCloseTo(60.714, 3);
    expect(component.cagr).toBeCloseTo(5.413, 3);
    expect(component.bestYear).toEqual({ year: 2023, value: 45 });
    expect(component.startLabel).toBe(2014);
    expect(component.endLabel).toBe(2023);
  });

  it('gracefully handles an empty price series', () => {
    component.priceSeries = [];
    component.ngOnChanges({
      priceSeries: new SimpleChange(null, [], false),
    });

    expect(component.startingValue).toBe(0);
    expect(component.endingValue).toBe(0);
    expect(component.netChange).toBe(0);
    expect(component.growthPct).toBe(0);
    expect(component.cagr).toBe(0);
    expect(component.bestYear).toBeNull();
    expect(component.lineChartData.labels?.length).toBe(0);
    expect(component.lineChartData.datasets[0].data.length).toBe(0);
    expect(component.startLabel).toBeNull();
    expect(component.endLabel).toBeNull();
  });

  it('rebuilds chart data when priceSeries changes', () => {
    const next = [
      { t: 2020, v: 10 },
      { t: 2021, v: 20 },
    ];
    component.priceSeries = next;
    component.ngOnChanges({ priceSeries: new SimpleChange(null, next, false) });

    expect(component.lineChartData.labels).toEqual(['2020', '2021']);
    expect(component.lineChartData.datasets[0].data).toEqual([10, 20]);
    expect(component.startingValue).toBe(10);
    expect(component.endingValue).toBe(20);
  });

  it('supports string x-axis labels', () => {
    const next = [
      { t: 'Q1', v: 5 },
      { t: 'Q2', v: 7 },
    ];
    component.priceSeries = next;
    component.ngOnChanges({ priceSeries: new SimpleChange(null, next, false) });

    expect(component.lineChartData.labels).toEqual(['Q1', 'Q2']);
    expect(component.bestYear).toEqual({ year: 'Q2', value: 7 });
  });

  it('derives metrics for a single data point', () => {
    const next = [{ t: 2024, v: 12 }];
    component.priceSeries = next;
    component.ngOnChanges({ priceSeries: new SimpleChange(null, next, false) });

    expect(component.startingValue).toBe(12);
    expect(component.endingValue).toBe(12);
    expect(component.netChange).toBe(0);
    expect(component.cagr).toBe(0);
    expect(component.bestYear).toEqual({ year: 2024, value: 12 });
  });

  it('accepts transactions input without mutation', () => {
    const tx = [{ date: '2024-01-01', price: 1_000_000, location: 'Paris' }];
    component.transactions = tx;
    expect(component.transactions).toBe(tx);
  });
});
