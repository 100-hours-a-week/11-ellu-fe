'use client';

import Chart from 'react-apexcharts';

export default function UserPieChart() {
  const chartOptions = {
    chart: {
      height: 350,
    },
    labels: ['나의 스케줄 달성률', '남은 스케줄'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    legend: {
      position: 'bottom' as const,
    },
    colors: ['#1a73e8', '#9ecbff'],
  };

  const series = [134, 40];

  return (
    <div>
      <Chart options={chartOptions} series={series} type="pie" height={180} />
    </div>
  );
}
