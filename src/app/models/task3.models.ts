export interface Asset {
  name: string;
  origin: string;
  location: string;
  image: string;
  estimatedValue: number;
  currency: string;
  acquisitionDate: string;
  acquisitionCost: number;
  serialNumber: string;
  provenance: string;
  condition: string;
}

export interface PricePoint {
  year: number;
  value: number;
}

export interface Transaction {
  date: string;
  assetName: string;
  condition: string;
  salePrice: number;
  location: string;
}

export interface AssetDashboardConfig {
  assetEyebrow: string;
  assetSubtitle: string;
  assetValueLabel: string;
  assetAppraisalChange: number;
  assetDetailsTitle: string;
  assetValueOverTimeTitle: string;
  transactionHistoryTitle: string;
  transactionHistorySubtitle: string;
  footerBrand: string;
  footerTagline: string;
  footerEstablished?: string;
}
