import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { YearlyComparison } from '../../types';

interface YearlyComparisonChartProps {
  data: YearlyComparison[];
}

type ChartType = 'bar' | 'pie';
type PieMetric = 'units' | 'revenue';

export const YearlyComparisonChart: React.FC<YearlyComparisonChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [pieMetric, setPieMetric] = useState<PieMetric>('units');

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  const getBarChartOption = () => ({
    title: {
      text: 'Year-over-Year Comparison',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const yearData = params[0];
        const revenueData = params[1];
        const growthData = params[2];
        
        return `
          <div style="font-weight: bold;">${yearData.axisValue}</div>
          ${yearData.marker} Units Sold: ${yearData.value.toLocaleString()}<br/>
          ${revenueData.marker} Revenue: $${(revenueData.value / 1000000).toFixed(1)}M<br/>
          ${growthData.marker} Growth Rate: ${growthData.value}%
        `;
      }
    },
    legend: {
      data: ['Units Sold', 'Revenue (millions)', 'Growth Rate (%)'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.year.toString()),
      axisLabel: {
        fontWeight: 'bold'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Units / Revenue (M)',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value.toString()
        }
      },
      {
        type: 'value',
        name: 'Growth Rate (%)',
        position: 'right',
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'Units Sold',
        type: 'bar',
        data: data.map(d => d.totalUnits),
        itemStyle: {
          color: '#3b82f6'
        },
        emphasis: {
          itemStyle: {
            color: '#1d4ed8'
          }
        }
      },
      {
        name: 'Revenue (millions)',
        type: 'bar',
        data: data.map(d => d.totalRevenue / 1000000),
        itemStyle: {
          color: '#10b981'
        },
        emphasis: {
          itemStyle: {
            color: '#047857'
          }
        }
      },
      {
        name: 'Growth Rate (%)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.growthRate),
        itemStyle: {
          color: '#f59e0b'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  });

  const getPieChartOption = () => {
    const pieData = data.map((item, index) => ({
      name: item.year.toString(),
      value: pieMetric === 'units' ? item.totalUnits : item.totalRevenue / 1000000,
      itemStyle: {
        color: colors[index % colors.length]
      }
    }));

    return {
      title: {
        text: `Year-over-Year ${pieMetric === 'units' ? 'Units Sold' : 'Revenue'} Distribution`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const suffix = pieMetric === 'units' ? 'units' : 'M';
          const value = pieMetric === 'units' ? params.value.toLocaleString() : `$${params.value.toFixed(1)}M`;
          return `${params.marker} ${params.name}: ${value} (${params.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        data: data.map(d => d.year.toString())
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: (params: any) => {
              const suffix = pieMetric === 'units' ? '' : 'M';
              const value = pieMetric === 'units' ? params.value.toLocaleString() : `$${params.value.toFixed(1)}M`;
              return `${params.name}\n${value}`;
            }
          }
        }
      ]
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Chart Type:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                chartType === 'bar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                chartType === 'pie'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart className="w-4 h-4" />
              Pie Chart
            </button>
          </div>
        </div>

        {/* Pie Chart Metric Selector */}
        {chartType === 'pie' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPieMetric('units')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pieMetric === 'units'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Units
              </button>
              <button
                onClick={() => setPieMetric('revenue')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pieMetric === 'revenue'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Revenue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chart - Conditionally render based on chart type */}
      <div className="chart-container">
        {chartType === 'bar' ? (
          <ReactECharts 
            key="bar-chart"
            option={getBarChartOption()} 
            style={{ height: '400px' }} 
          />
        ) : (
          <ReactECharts 
            key={`pie-chart-${pieMetric}`}
            option={getPieChartOption()} 
            style={{ height: '400px' }} 
          />
        )}
      </div>
    </div>
  );
};
