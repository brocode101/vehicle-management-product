import React from 'react';
import ReactECharts from 'echarts-for-react';
import { QuarterlySummary } from '../../types';

interface QuarterlySalesChartProps {
  data: QuarterlySummary[];
}

export const QuarterlySalesChart: React.FC<QuarterlySalesChartProps> = ({ data }) => {
  const option = {
    title: {
      text: 'Quarterly Sales Performance',
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
      data: data.map(d => `${d.year} Q${d.quarter}`),
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
        type: 'line',
        data: data.map(d => d.totalUnits),
        itemStyle: {
          color: '#3b82f6'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          opacity: 0.1
        }
      },
      {
        name: 'Revenue (millions)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.totalRevenue / 1000000),
        itemStyle: {
          color: '#10b981'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'diamond',
        symbolSize: 8,
        areaStyle: {
          opacity: 0.1
        }
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <ReactECharts option={option} style={{ height: '400px' }} />
    </div>
  );
};
