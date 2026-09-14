import {
  Asset,
  AssetDashboardConfig,
  PricePoint,
  Transaction,
} from '../models/task3.models';

export const ASSET: Asset = {
  name: '1964 Aston Martin DB5',
  origin: 'London, United Kingdom',
  location: 'Private Collection, Munich, Germany',
  image: '/car_1.png',
  estimatedValue: 6200000,
  currency: 'USD',
  acquisitionDate: '2014-04-04',
  acquisitionCost: 4100000,
  serialNumber: 'DB5/1877/R',
  provenance:
    'Previously owned by a European collector and displayed at international classic-car exhibitions.',
  condition: 'Excellent (Restored)',
};

export const DASHBOARD_CONFIG: AssetDashboardConfig = {
  assetEyebrow: 'A British Icon',
  assetSubtitle:
    'More than a car — a symbol of elegance, innovation and cinematic history.',
  assetValueLabel: 'Current Estimated Value',
  assetAppraisalChange: 12,
  assetDetailsTitle: 'Asset Details',
  assetValueOverTimeTitle: 'Asset Value Over Time',
  transactionHistoryTitle: 'Transaction History',
  transactionHistorySubtitle: 'Appraisals of similar assets',
  footerBrand: 'Aston Martin',
  footerTagline: 'Drive History. Preserve Value.',
  footerEstablished: 'Est. 1913',
};

export const PRICE_SERIES: PricePoint[] = [
  { year: 2014, value: 4100000 },
  { year: 2015, value: 4250000 },
  { year: 2016, value: 4400000 },
  { year: 2017, value: 4550000 },
  { year: 2018, value: 4500000 },
  { year: 2019, value: 4750000 },
  { year: 2020, value: 5050000 },
  { year: 2021, value: 5300000 },
  { year: 2022, value: 5650000 },
  { year: 2023, value: 5900000 },
  { year: 2024, value: 6200000 },
];

export const TRANSACTIONS: Transaction[] = [
  {
    date: '2023-11-02',
    assetName: '1964 Aston Martin DB5',
    condition: 'Excellent',
    salePrice: 6150000,
    location: 'Geneva, Switzerland',
  },
  {
    date: '2022-08-18',
    assetName: '1964 Aston Martin DB5',
    condition: 'Excellent',
    salePrice: 5820000,
    location: 'Monterey, USA',
  },
  {
    date: '2021-05-18',
    assetName: '1964 Aston Martin DB5',
    condition: 'Good',
    salePrice: 5250000,
    location: 'London, UK',
  },
  {
    date: '2019-09-27',
    assetName: '1964 Aston Martin DB5',
    condition: 'Good',
    salePrice: 4700000,
    location: 'Paris, France',
  },
];

export const GALLERY_IMAGES: string[] = [
  '/car_1.png',
  '/car_2.png',
  '/car_3.png',
  '/car_4.png',
  '/car_5.png',
  '/car_6.png',
];
