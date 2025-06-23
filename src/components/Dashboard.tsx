import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { mockSalesData } from '../data/mockData';
import { 
  getQuarterlySummary, 
  getYearlyComparison, 
  getBrandPerformance, 
  getCategoryBreakdown 
} from '../utils/dataProcessing';
import { StatsCard } from './StatsCard';
import { YearlyComparisonChart } from './charts/YearlyComparisonChart';
import { QuarterlySalesChart } from './charts/QuarterlySalesChart';
import { BrandPerformanceChart } from './charts/BrandPerformanceChart';
import { CategoryBreakdownChart } from './charts/CategoryBreakdownChart';
import { PDFExport } from './PDFExport';

export const Dashboard: React.FC = () => {
  const processedData = useMemo(() => {
    const quarterlySummary = getQuarterlySummary(mockSalesData);
    const yearlyComparison = getYearlyComparison(mockSalesData);
    const brandPerformance = getBrandPerformance(mockSalesData);
    const categoryBreakdown = getCategoryBreakdown(mockSalesData);

    // Calculate key metrics
    const totalUnits = mockSalesData.reduce((sum, sale) => sum + sale.unitsSold, 0);
    const totalRevenue = mockSalesData.reduce((sum, sale) => sum + sale.revenue, 0);
    const latestYear = Math.max(...yearlyComparison.map(y => y.year));
    const latestYearGrowth = yearlyComparison.find(y => y.year === latestYear)?.growthRate || 0;
    const averageRevenue = totalRevenue / totalUnits;

    // Current quarter data
    const currentQuarter = quarterlySummary[quarterlySummary.length - 1];
    const previousQuarter = quarterlySummary[quarterlySummary.length - 2];
    const quarterlyGrowth = previousQuarter 
      ? ((currentQuarter.totalUnits - previousQuarter.totalUnits) / previousQuarter.totalUnits) * 100
      : 0;

    return {
      quarterlySummary,
      yearlyComparison,
      brandPerformance,
      categoryBreakdown,
      totalUnits,
      totalRevenue,
      latestYearGrowth,
      averageRevenue,
      quarterlyGrowth,
      currentQuarter
    };
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">2022 - 2024 Performance Analytics</p>
          </div>
          <PDFExport
            salesData={mockSalesData}
            yearlyComparison={processedData.yearlyComparison}
            quarterlySummary={processedData.quarterlySummary}
            brandPerformance={processedData.brandPerformance}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Units Sold"
          value={processedData.totalUnits.toLocaleString()}
          change={processedData.latestYearGrowth}
          changeLabel="vs last year"
          icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${(processedData.totalRevenue / 1000000).toFixed(1)}M`}
          change={processedData.latestYearGrowth}
          changeLabel="vs last year"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
        />
        <StatsCard
          title="Average Revenue per Unit"
          value={`$${processedData.averageRevenue.toFixed(0)}`}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
        />
        <StatsCard
          title="Current Quarter"
          value={`${processedData.currentQuarter.totalUnits.toLocaleString()} units`}
          change={processedData.quarterlyGrowth}
          changeLabel="vs last quarter"
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <YearlyComparisonChart data={processedData.yearlyComparison} />
        <QuarterlySalesChart data={processedData.quarterlySummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandPerformanceChart data={processedData.brandPerformance} />
        <CategoryBreakdownChart data={processedData.categoryBreakdown} />
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Dashboard last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-1">Data includes vehicle sales from 2022-2024 across all categories and brands</p>
      </div>
    </div>
  );
};
