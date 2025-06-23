export interface VehicleSales {
  id: string;
  year: number;
  quarter: number;
  month: string;
  brand: string;
  model: string;
  unitsSold: number;
  revenue: number;
  category: 'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Electric';
}

export interface QuarterlySummary {
  quarter: number;
  year: number;
  totalUnits: number;
  totalRevenue: number;
  topBrand: string;
}

export interface YearlyComparison {
  year: number;
  totalUnits: number;
  totalRevenue: number;
  growthRate: number;
}

export interface Vehicle {
  id: string;
  registration: string;
  brand: string;
  model: string;
  value: number;
  year: number;
  category: 'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Electric';
  color: string;
  mileage: number;
  status: 'Available' | 'Sold' | 'Reserved';
  createdAt: Date;
  updatedAt: Date;
}
