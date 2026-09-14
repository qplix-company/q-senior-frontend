import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
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
export class Task3Component {
  readonly asset = input<Asset>(ASSET);
  readonly config = input<AssetDashboardConfig>(DASHBOARD_CONFIG);
  readonly priceSeries = input<PricePoint[]>(PRICE_SERIES);
  readonly transactions = input<Transaction[]>(TRANSACTIONS);
  readonly galleryImages = input<string[]>(GALLERY_IMAGES);

  private readonly currencyPipe = new CurrencyPipe('en-US');
  private readonly datePipe = new DatePipe('en-US');

  protected readonly displayedColumns = ['date', 'assetName', 'condition', 'salePrice', 'location'];

  protected readonly galleryIndex = signal(0);

  protected readonly galleryImage = computed(() => {
    const images = this.galleryImages();
    return images[this.galleryIndex()] ?? this.asset().image;
  });

  protected readonly assetDetails = computed(() => this.buildAssetDetails(this.asset()));
  protected readonly metrics = computed(() => this.buildMetrics(this.priceSeries()));
  protected readonly chartData = computed(() => this.buildChartData(this.priceSeries()));

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

  protected nextImage(): void {
    const length = this.galleryImages().length;
    if (!length) return;
    this.galleryIndex.update((index) => (index + 1) % length);
  }

  protected previousImage(): void {
    const length = this.galleryImages().length;
    if (!length) return;
    this.galleryIndex.update((index) => (index - 1 + length) % length);
  }

  private buildAssetDetails(asset: Asset): AssetDetail[] {
    return [
      { label: 'Acquisition Date', value: this.formatDate(asset.acquisitionDate), icon: 'event' },
      { label: 'Acquisition Cost', value: this.formatCurrency(asset.acquisitionCost), icon: 'payments' },
      { label: 'Serial / Reference', value: asset.serialNumber, icon: 'tag' },
      { label: 'Condition', value: asset.condition, icon: 'verified', emphasis: 'condition' },
      { label: 'Provenance', value: asset.provenance, icon: 'history_edu', emphasis: 'provenance' },
      { label: 'Origin', value: asset.origin, icon: 'public' },
      { label: 'Location', value: asset.location, icon: 'location_on' },
    ];
  }

  private buildMetrics(priceSeries: PricePoint[]): PerformanceMetric[] {
    const firstValue = priceSeries.at(0)?.value ?? 0;
    const lastValue = priceSeries.at(-1)?.value ?? 0;
    const gain = lastValue - firstValue;
    const returnPercentage = firstValue > 0 ? (gain / firstValue) * 100 : 0;

    const periods = priceSeries.length - 1;
    const cagr =
      firstValue > 0 && periods > 0 ? (Math.pow(lastValue / firstValue, 1 / periods) - 1) * 100 : 0;

    return [
      { label: 'Total Gain', value: this.formatCompactCurrency(gain), icon: 'trending_up' },
      { label: 'Return Since Purchase', value: `${returnPercentage.toFixed(1)}%`, icon: 'percent' },
      { label: 'CAGR', value: `${cagr.toFixed(1)}%`, icon: 'query_stats' },
    ];
  }

  private buildChartData(priceSeries: PricePoint[]): ChartData<'line'> {
    return {
      labels: priceSeries.map((point) => point.year),
      datasets: [
        {
          data: priceSeries.map((point) => point.value),
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
    return this.currencyPipe.transform(value, this.asset().currency, 'symbol', '1.0-0') ?? '';
  }

  private formatCompactCurrency(value: number): string {
    return this.currencyPipe.transform(value, this.asset().currency, 'symbol', '1.0-1') ?? '';
  }

  private formatDate(value: string): string {
    return this.datePipe.transform(value, 'MMM d, y') ?? '';
  }
}
