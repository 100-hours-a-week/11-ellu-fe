'use client';

import { ActivityCalendar } from 'react-activity-calendar';
import { useGetUserProgress } from '@/hooks/api/user/userGetProgress';

const generateEmptyYearData = () => {
  const data = [];
  const today = new Date();

  for (let i = 185; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      count: 0,
      level: 0,
    });
  }

  return data;
};

export default function UserProgressChart() {
  const { data: userProgress, isLoading, isError } = useGetUserProgress();

  const processData = (() => {
    const emptyData = generateEmptyYearData();

    if (!userProgress || isLoading || isError) {
      return emptyData;
    }

    return emptyData.map((empty) => {
      const userData = userProgress.find((item) => item.date === empty.date);

      if (userData) {
        return {
          date: empty.date,
          count: userData.created_schedules,
          level: Math.min(userData.created_schedules, 4),
        };
      }

      return empty;
    });
  })();

  return (
    <ActivityCalendar
      data={processData}
      theme={{
        light: ['#ebedf0', '#9ecbff', '#4285f4', '#1a73e8', '#1557b0'],
        dark: ['#161b22', '#1e293b', '#3b82f6', '#2563eb', '#1d4ed8'],
      }}
    />
  );
}
