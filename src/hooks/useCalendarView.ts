import { useState, useCallback } from 'react';

export function useCalendarView() {
  const [currentView, setCurrentView] = useState<string>('timeGridWeek');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 캘린더 뷰가 변경될 때 호출되는 핸들러
  const handleViewChange = useCallback((viewInfo: any) => {
    console.log('View changed to:', viewInfo.view.type);
    setCurrentView(viewInfo.view.type);
  }, []);

  // 날짜 범위가 변경될 때 호출되는 핸들러
  const handleDatesSet = useCallback((dateInfo: any) => {
    console.log('Date range changed:', {
      start: dateInfo.start,
      end: dateInfo.end,
      view: dateInfo.view.type,
    });
    setCurrentDate(dateInfo.start);
  }, []);

  return {
    currentView,
    currentDate,
    handleViewChange,
    handleDatesSet,
  };
}
