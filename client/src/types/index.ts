export interface DashboardMetrics {
  revenue: string;
  efficiency: number;
  distributors: number;
  turnover: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  product: string;
  efficiency: number;
  status: 'running' | 'scheduled' | 'maintenance';
}

export interface TopProduct {
  product: {
    id: string;
    sku: string;
    name: string;
  };
  revenue: string;
  units: number;
}

export interface RegionalMetric {
  region: string;
  revenue: string;
  units: number;
  distributors?: number;
}

export interface CurrencyRate {
  currency: string;
  rate: number;
  symbol: string;
  flag: string;
}

export interface Brand {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: string;
}

export interface InventoryStatus {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  level: number;
  threshold: number;
}

export interface DemandForecastPoint {
  date: string;
  actual?: number;
  predicted: number;
  confidence: number;
}
