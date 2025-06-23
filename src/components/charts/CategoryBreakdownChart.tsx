import React from 'react';
import ReactECharts from 'echarts-for-react';

interface CategoryBreakdownChartProps {
  data: Array<{ category: string; units: number }>;
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const option = {
    title: {
      text: 'Vehicle Category Breakdown',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.marker} ${params.name}: ${params.value.toLocaleString()} units (${params.percent}%)`;
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: data.map((item, index) => ({
          name: item.category,
          value: item.units,
          itemStyle: {
            color: colors[index % colors.length]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
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
