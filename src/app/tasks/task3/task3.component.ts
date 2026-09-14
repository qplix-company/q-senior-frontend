import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Asset, AssetDashboardConfig, PricePoint, Transaction } from '../../models/task3.models';
import { ASSET, DASHBOARD_CONFIG, GALLERY_IMAGES, PRICE_SERIES, TRANSACTIONS } from '../../mocks/task3-mocks';

interface AssetDetail {
  label: string;
  value: string;
  icon: string;
  emphasis?: 'condition' | 'provenance';
}

interface PerformanceMetric {
  label: string;
  value: string;
  icon: string;
}

const CHART_PALETTE = {
  chart: '#b78335',
  axis: '#72766f',
  grid: 'rgba(40, 50, 42, 0.08)',
  fill: 'rgba(183, 131, 53, 0.14)',
  pointBorder: '#ffffff',
};

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatIconModule, MatTableModule, BaseChartDirective],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component implements OnChanges {
  @Input() asset: Asset = ASSET;
  @Input() config: AssetDashboardConfig = DASHBOARD_CONFIG;
  @Input() priceSeries: PricePoint[] = PRICE_SERIES;
  @Input() transactions: Transaction[] = TRANSACTIONS;
  @Input() galleryImages: string[] = GALLERY_IMAGES;

  private readonly currencyPipe = new CurrencyPipe('en-US');
  private readonly datePipe = new DatePipe('en-US');

  protected readonly displayedColumns = ['date', 'assetName', 'condition', 'salePrice', 'location'];

  protected galleryIndex = 0;
  protected assetDetails: AssetDetail[] = [];
  protected metrics: PerformanceMetric[] = [];
  protected chartData: ChartData<'line'> = { labels: [], datasets: [] };

  protected readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label ?? '',
          label: (context) =>
            typeof context.parsed.y === 'number' ? this.formatCurrency(context.parsed.y) : '',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: CHART_PALETTE.axis },
      },
      y: {
        border: { display: false },
        grid: { color: CHART_PALETTE.grid },
        ticks: { color: CHART_PALETTE.axis, callback: (value) => this.formatCompactCurrency(Number(value)) },
      },
    },
  };

  constructor() {
    this.rebuildViewModel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asset'] || changes['priceSeries'] || changes['config']) {
      this.rebuildViewModel();
    }
  }

  protected get galleryImage(): string {
    return this.galleryImages[this.galleryIndex] ?? this.asset.image;
  }

  protected nextImage(): void {
    if (!this.galleryImages.length) return;
    this.galleryIndex = (this.galleryIndex + 1) % this.galleryImages.length;
  }

  protected previousImage(): void {
    if (!this.galleryImages.length) return;
    this.galleryIndex = (this.galleryIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  private rebuildViewModel(): void {
    this.assetDetails = this.buildAssetDetails();
    this.metrics = this.buildMetrics();
    this.chartData = this.buildChartData();
  }

  private buildAssetDetails(): AssetDetail[] {
    return [
      { label: 'Acquisition Date', value: this.formatDate(this.asset.acquisitionDate), icon: 'event' },
      { label: 'Acquisition Cost', value: this.formatCurrency(this.asset.acquisitionCost), icon: 'payments' },
      { label: 'Serial / Reference', value: this.asset.serialNumber, icon: 'tag' },
      { label: 'Condition', value: this.asset.condition, icon: 'verified', emphasis: 'condition' },
      { label: 'Provenance', value: this.asset.provenance, icon: 'history_edu', emphasis: 'provenance' },
      { label: 'Origin', value: this.asset.origin, icon: 'public' },
      { label: 'Location', value: this.asset.location, icon: 'location_on' },
    ];
  }

  private buildMetrics(): PerformanceMetric[] {
    const firstValue = this.priceSeries.at(0)?.value ?? 0;
    const lastValue = this.priceSeries.at(-1)?.value ?? 0;
    const gain = lastValue - firstValue;
    const returnPercentage = firstValue > 0 ? (gain / firstValue) * 100 : 0;

    const periods = this.priceSeries.length - 1;
    const cagr =
      firstValue > 0 && periods > 0 ? (Math.pow(lastValue / firstValue, 1 / periods) - 1) * 100 : 0;

    return [
      { label: 'Total Gain', value: this.formatCompactCurrency(gain), icon: 'trending_up' },
      { label: 'Return Since Purchase', value: `${returnPercentage.toFixed(1)}%`, icon: 'percent' },
      { label: 'CAGR', value: `${cagr.toFixed(1)}%`, icon: 'query_stats' },
    ];
  }

  private buildChartData(): ChartData<'line'> {
    return {
      labels: this.priceSeries.map((point) => point.year),
      datasets: [
        {
          data: this.priceSeries.map((point) => point.value),
          borderColor: CHART_PALETTE.chart,
          backgroundColor: CHART_PALETTE.fill,
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          pointBorderColor: CHART_PALETTE.pointBorder,
          pointBackgroundColor: CHART_PALETTE.chart,
        },
      ],
    };
  }

  private formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, this.asset.currency, 'symbol', '1.0-0') ?? '';
  }

  private formatCompactCurrency(value: number): string {
    return this.currencyPipe.transform(value, this.asset.currency, 'symbol', '1.0-1') ?? '';
  }

  private formatDate(value: string): string {
    return this.datePipe.transform(value, 'MMM d, y') ?? '';
  }
}
