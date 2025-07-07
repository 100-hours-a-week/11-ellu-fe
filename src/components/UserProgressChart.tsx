import { ActivityCalendar } from 'react-activity-calendar';

const generateEmptyYearData = () => {
  const data = [];
  const today = new Date();

  for (let i = 179; i >= 0; i--) {
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
  return (
    <ActivityCalendar
      data={generateEmptyYearData()}
      theme={{
        light: ['#ebedf0', '#9ecbff', '#4285f4', '#1a73e8', '#1557b0'],
        dark: ['#161b22', '#1e293b', '#3b82f6', '#2563eb', '#1d4ed8'],
      }}
    />
  );
}
