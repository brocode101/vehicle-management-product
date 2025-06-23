import { VehicleSales, QuarterlySummary, YearlyComparison } from '../types';

export const getQuarterlySummary = (data: VehicleSales[]): QuarterlySummary[] => {
  const quarterlyData = new Map<string, QuarterlySummary>();
  
  data.forEach(sale => {
    const key = `${sale.year}-Q${sale.quarter}`;
    
    if (!quarterlyData.has(key)) {
      quarterlyData.set(key, {
        quarter: sale.quarter,
        year: sale.year,
        totalUnits: 0,
        totalRevenue: 0,
        topBrand: ''
      });
    }
    
    const summary = quarterlyData.get(key)!;
    summary.totalUnits += sale.unitsSold;
    summary.totalRevenue += sale.revenue;
  });
  
  // Calculate top brand for each quarter
  quarterlyData.forEach((summary, key) => {
    const [year, quarter] = key.split('-Q');
    const quarterData = data.filter(d => d.year === parseInt(year) && d.quarter === parseInt(quarter));
    
    const brandSales = new Map<string, number>();
    quarterData.forEach(sale => {
      brandSales.set(sale.brand, (brandSales.get(sale.brand) || 0) + sale.unitsSold);
    });
    
    let topBrand = '';
    let maxSales = 0;
    brandSales.forEach((sales, brand) => {
      if (sales > maxSales) {
        maxSales = sales;
        topBrand = brand;
      }
    });
    
    summary.topBrand = topBrand;
  });
  
  return Array.from(quarterlyData.values()).sort((a, b) => a.year - b.year || a.quarter - b.quarter);
};

export const getYearlyComparison = (data: VehicleSales[]): YearlyComparison[] => {
  const yearlyData = new Map<number, { totalUnits: number; totalRevenue: number }>();
  
  data.forEach(sale => {
    if (!yearlyData.has(sale.year)) {
      yearlyData.set(sale.year, { totalUnits: 0, totalRevenue: 0 });
    }
    
    const yearly = yearlyData.get(sale.year)!;
    yearly.totalUnits += sale.unitsSold;
    yearly.totalRevenue += sale.revenue;
  });
  
  const sortedYears = Array.from(yearlyData.keys()).sort();
  const comparison: YearlyComparison[] = [];
  
  sortedYears.forEach((year, index) => {
    const current = yearlyData.get(year)!;
    let growthRate = 0;
    
    if (index > 0) {
      const previous = yearlyData.get(sortedYears[index - 1])!;
      growthRate = ((current.totalUnits - previous.totalUnits) / previous.totalUnits) * 100;
    }
    
    comparison.push({
      year,
      totalUnits: current.totalUnits,
      totalRevenue: current.totalRevenue,
      growthRate: parseFloat(growthRate.toFixed(2))
    });
  });
  
  return comparison;
};

export const getBrandPerformance = (data: VehicleSales[]) => {
  const brandData = new Map<string, { units: number; revenue: number }>();
  
  data.forEach(sale => {
    if (!brandData.has(sale.brand)) {
      brandData.set(sale.brand, { units: 0, revenue: 0 });
    }
    
    const brand = brandData.get(sale.brand)!;
    brand.units += sale.unitsSold;
    brand.revenue += sale.revenue;
  });
  
  return Array.from(brandData.entries())
    .map(([brand, data]) => ({ brand, ...data }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 10);
};

export const getCategoryBreakdown = (data: VehicleSales[]) => {
  const categoryData = new Map<string, number>();
  
  data.forEach(sale => {
    categoryData.set(sale.category, (categoryData.get(sale.category) || 0) + sale.unitsSold);
  });
  
  return Array.from(categoryData.entries()).map(([category, units]) => ({ category, units }));
};
