import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {ChartConfiguration, ChartData} from 'chart.js';
import 'chart.js/auto';
import {BaseChartDirective, provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {SHARED_IMPORTS} from '../../shared/mat-imports';

export interface Asset {
  name: string;
  category: string;
  medium: string;
  origin: string;
  location: string;
  image: string;
  estimatedValue: number;
  currency: string;
  lastAppraisal: string | Date;
  acquisitionDate: string | Date;
  acquisitionCost: number;
  serialNumber: string;
  provenance: string;
  condition: string;
}

export interface PricePoint {
  t: number | string;
  v: number;
}

export interface Transaction {
  date: string | Date;
  price: number;
  location: string;
}

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [...SHARED_IMPORTS, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component implements OnChanges {
  @Input() asset: Asset = {
    name: '1964 Aston Martin DB5',
    category: 'Automotive / Classic Car',
    medium: 'Grand touring coupe',
    origin: 'Originally delivered to London, UK',
    location: 'Private collection, Munich, Germany',
    image: 'assets/astonMartin.png',
    estimatedValue: 6_200_000,
    currency: 'USD',
    lastAppraisal: '2023-09-18',
    acquisitionDate: '2014-04-04',
    acquisitionCost: 4_100_000,
    serialNumber: 'DB5/1877/R',
    provenance: 'Owned by a famous celebrity; displayed at a renowned museum',
    condition: 'Pristine',
  };

  @Input() priceSeries: PricePoint[] = [
    { t: 2014, v: 28 },
    { t: 2015, v: 30 },
    { t: 2016, v: 32 },
    { t: 2017, v: 34 },
    { t: 2018, v: 33 },
    { t: 2019, v: 36 },
    { t: 2020, v: 39 },
    { t: 2021, v: 41 },
    { t: 2022, v: 43 },
    { t: 2023, v: 45 },
  ];

  @Input() transactions: Transaction[] = [
    { date: '2023-11-02', price: 44_000_000, location: 'Geneva, Switzerland' },
    { date: '2021-05-18', price: 40_500_000, location: 'New York, USA' },
    { date: '2018-10-09', price: 33_250_000, location: 'London, UK' },
    { date: '2015-03-27', price: 29_800_000, location: 'Paris, France' },
  ];

  get startingValue(): number {
    return this.priceSeries[0]?.v ?? 0;
  }

  get endingValue(): number {
    return this.priceSeries[this.priceSeries.length - 1]?.v ?? 0;
  }
  get startLabel(): string | number | null {
    return this.priceSeries.length ? this.priceSeries[0].t : null;
  }
  get endLabel(): string | number | null {
    return this.priceSeries.length ? this.priceSeries[this.priceSeries.length - 1].t : null;
  }

  get netChange(): number {
    return this.endingValue - this.startingValue;
  }

  get growthPct(): number {
    if (!this.startingValue) {
      return 0;
    }
    return (this.netChange / this.startingValue) * 100;
  }

  get cagr(): number {
    const periods = this.priceSeries.length - 1;
    if (periods <= 0 || !this.startingValue) {
      return 0;
    }
    return (
      (Math.pow(this.endingValue / this.startingValue, 1 / periods) - 1) * 100
    );
  }

  get bestYear(): { year: string | number; value: number } | null {
    if (!this.priceSeries.length) {
      return null;
    }
    const bestPoint = this.priceSeries.reduce(
      (best, current) => (current.v > best.v ? current : best),
      this.priceSeries[0]
    );
    return { year: bestPoint.t, value: bestPoint.v };
  }


  lineChartData: ChartData<'line'> = this.buildChartData(this.priceSeries);

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: 'index',
        callbacks: {
          label: (ctx) => {
            const y = ctx.parsed.y;
            return `${typeof y === 'number' ? y.toFixed(1) : 0}M USD`;
          },
          title: (items) => `Year ${items[0]?.label}`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          callback: (value) => `${value}M`,
        },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceSeries']) {
      this.lineChartData = this.buildChartData(this.priceSeries);
    }
  }

  private buildChartData(series: PricePoint[]): ChartData<'line'> {
    const labels = series.map((d) => d.t?.toString());
    const data = series.map((d) => d.v);
    return {
      labels,
      datasets: [
        {
          data,
          label: 'Estimated value',
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.15)',
          tension: 0.3,
          fill: {
            target: 'origin',
            above: 'rgba(13, 110, 253, 0.08)',
          },
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderColor: '#0d6efd',
          pointBackgroundColor: '#ffffff',
          pointHoverBackgroundColor: '#0d6efd',
          pointHoverBorderColor: '#fff',
          clip: 0,
        },
      ],
    };
  }
}
