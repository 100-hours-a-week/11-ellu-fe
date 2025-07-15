'use client';

import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useGetAchievements } from '@/hooks/api/user/useGetAchievements';

export default function UserPieChart() {
  const [uncompletedSchedules, setUncompletedSchedules] = useState(0);
  const { data: userAchievements, isLoading } = useGetAchievements();

  useEffect(() => {
    if (userAchievements) {
      setUncompletedSchedules(userAchievements?.total_schedules - userAchievements?.completed_schedules);
    }
  }, [userAchievements]);

  const chartOptions = {
    chart: {
      height: 350,
    },
    labels: ['달성한 일정', '남은 일정'],
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

  const series = [userAchievements?.completed_schedules as number, uncompletedSchedules];

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <Chart options={chartOptions} series={series} type="pie" height={180} />
    </div>
  );
}
