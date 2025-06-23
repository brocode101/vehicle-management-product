import React from 'react';
import ReactECharts from 'echarts-for-react';

interface BrandPerformanceChartProps {
  data: Array<{ brand: string; units: number; revenue: number }>;
}

export const BrandPerformanceChart: React.FC<BrandPerformanceChartProps> = ({ data }) => {
  const option = {
    title: {
      text: 'Top 10 Brand Performance',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const unitsData = params[0];
        const revenueData = params[1];
        
        return `
          <div style="font-weight: bold;">${unitsData.axisValue}</div>
          ${unitsData.marker} Units Sold: ${unitsData.value.toLocaleString()}<br/>
          ${revenueData.marker} Revenue: $${(revenueData.value / 1000000).toFixed(1)}M
        `;
      }
    },
    legend: {
      data: ['Units Sold', 'Revenue (millions)'],
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
      data: data.map(d => d.brand),
      axisLabel: {
        rotate: 45,
        fontWeight: 'bold'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Units Sold',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value.toString()
        }
      },
      {
        type: 'value',
        name: 'Revenue (millions)',
        position: 'right',
        axisLabel: {
          formatter: '{value}M'
        }
      }
    ],
    series: [
      {
        name: 'Units Sold',
        type: 'bar',
        data: data.map(d => d.units),
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
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.revenue / 1000000),
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
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <ReactECharts option={option} style={{ height: '400px' }} />
    </div>
  );
};
