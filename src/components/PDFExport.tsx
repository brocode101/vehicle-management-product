import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { VehicleSales, YearlyComparison, QuarterlySummary } from '../types';

interface PDFExportProps {
  salesData: VehicleSales[];
  yearlyComparison: YearlyComparison[];
  quarterlySummary: QuarterlySummary[];
  brandPerformance: Array<{ brand: string; units: number; revenue: number }>;
}

export const PDFExport: React.FC<PDFExportProps> = ({
  salesData,
  yearlyComparison,
  quarterlySummary,
  brandPerformance
}) => {
  const exportToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Vehicle Sales Dashboard Report', 105, 20, { align: 'center' });
    
    // Report date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    let yPosition = 45;

    // Executive Summary
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', 20, yPosition);
    yPosition += 10;

    const totalUnits = salesData.reduce((sum, sale) => sum + sale.unitsSold, 0);
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0);
    const latestYear = Math.max(...yearlyComparison.map(y => y.year));
    const latestYearGrowth = yearlyComparison.find(y => y.year === latestYear)?.growthRate || 0;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Units Sold (2022-2024): ${totalUnits.toLocaleString()}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Total Revenue (2022-2024): $${(totalRevenue / 1000000).toFixed(1)}M`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Growth Rate (${latestYear}): ${latestYearGrowth.toFixed(1)}%`, 20, yPosition);
    yPosition += 15;

    // Yearly Comparison Table
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Yearly Performance Comparison', 20, yPosition);
    yPosition += 10;

    autoTable(pdf, {
      startY: yPosition,
      head: [['Year', 'Units Sold', 'Revenue ($M)', 'Growth Rate (%)']],
      body: yearlyComparison.map(year => [
        year.year.toString(),
        year.totalUnits.toLocaleString(),
        (year.totalRevenue / 1000000).toFixed(1),
        year.growthRate.toFixed(1)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPosition > 240) {
      pdf.addPage();
      yPosition = 20;
    }

    // Quarterly Summary Table
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Quarterly Performance Summary', 20, yPosition);
    yPosition += 10;

    autoTable(pdf, {
      startY: yPosition,
      head: [['Quarter', 'Units Sold', 'Revenue ($M)', 'Top Brand']],
      body: quarterlySummary.slice(-8).map(quarter => [
        `${quarter.year} Q${quarter.quarter}`,
        quarter.totalUnits.toLocaleString(),
        (quarter.totalRevenue / 1000000).toFixed(1),
        quarter.topBrand
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 20, right: 20 }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }

    // Brand Performance Table
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top 10 Brand Performance', 20, yPosition);
    yPosition += 10;

    autoTable(pdf, {
      startY: yPosition,
      head: [['Brand', 'Units Sold', 'Revenue ($M)', 'Market Share (%)']],
      body: brandPerformance.map(brand => [
        brand.brand,
        brand.units.toLocaleString(),
        (brand.revenue / 1000000).toFixed(1),
        ((brand.units / totalUnits) * 100).toFixed(1)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11] },
      margin: { left: 20, right: 20 }
    });

    // Capture charts as images
    try {
      const chartElements = document.querySelectorAll('.echarts-for-react');
      
      if (chartElements.length > 0) {
        pdf.addPage();
        let chartY = 20;
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Charts & Visualizations', 105, chartY, { align: 'center' });
        chartY += 20;

        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const element = chartElements[i] as HTMLElement;
          try {
            const canvas = await html2canvas(element, {
              scale: 1,
              useCORS: true,
              allowTaint: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 170;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (chartY + imgHeight > 280) {
              pdf.addPage();
              chartY = 20;
            }
            
            pdf.addImage(imgData, 'PNG', 20, chartY, imgWidth, Math.min(imgHeight, 100));
            chartY += Math.min(imgHeight, 100) + 10;
          } catch (error) {
            console.warn('Could not capture chart:', error);
          }
        }
      }
    } catch (error) {
      console.warn('Could not capture charts:', error);
    }

    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      pdf.text('Vehicle Sales Dashboard - Confidential', 20, 290);
    }

    // Save the PDF
    pdf.save(`vehicle-sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <button
      onClick={exportToPDF}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
    >
      <Download className="w-4 h-4" />
      Export PDF Report
    </button>
  );
};
