import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function DemandChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  const { data: forecast } = useQuery({
    queryKey: ["/api/demand-forecast"],
  });

  useEffect(() => {
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => initChart();
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forecast]);

  const initChart = () => {
    if (!chartRef.current || !window.Chart) return;

    const ctx = chartRef.current.getContext('2d');

    // Generate sample data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const actualData = [65000, 67500, 72000, 68500, 74000, 77500, 82000, 79000, 84500, 88000, 85500, 91000];
    const forecastData = [66200, 68100, 71800, 68900, 73500, 78200, 81500, 79800, 85100, 87500, 86200, 90500];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Actual Demand',
            data: actualData,
            borderColor: '#1e3a8a',
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'AI Forecast',
            data: forecastData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value: any) {
                return (value / 1000).toFixed(0) + 'K';
              }
            }
          }
        }
      }
    });
  };

  return (
    <div className="h-64 w-full">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
}
