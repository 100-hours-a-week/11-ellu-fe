import { useState, useCallback } from 'react';

export function useCalendarView() {
  const [currentView, setCurrentView] = useState<string>('timeGridWeek');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handleDatesSet = useCallback((dateInfo: any) => {
    const type = dateInfo.view.type;
    if (type === 'timeGridDay') {
      setCurrentView('day');
    } else if (type === 'timeGridWeek') {
      setCurrentView('week');
    } else if (type === 'dayGridMonth') {
      setCurrentView('month');
    } else if (type === 'multiMonthYear') {
      setCurrentView('year');
    }

    setCurrentDate(dateInfo.start);
  }, []);

  return {
    currentView,
    currentDate,
    handleDatesSet,
  };
}
