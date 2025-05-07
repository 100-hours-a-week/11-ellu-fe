import { useState, useCallback } from 'react';

export function useCalendarView() {
  const [currentView, setCurrentView] = useState<string>('timeGridWeek');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // 추가: 실제 뷰 타입을 저장하는 상태
  const [viewType, setViewType] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // 캘린더 뷰가 변경될 때 호출되는 핸들러
  const handleViewChange = useCallback((viewInfo: any) => {
    console.log('View changed to:', viewInfo.view.type);
    setCurrentView(viewInfo.view.type);

    // 보기 유형에 따라 viewType 설정
    const type = viewInfo.view.type;
    if (type === 'timeGridDay') {
      setViewType('day');
    } else if (type === 'timeGridWeek') {
      setViewType('week');
    } else if (type === 'dayGridMonth') {
      setViewType('month');
    } else if (type === 'multiMonthYear') {
      setViewType('year');
    }
  }, []);

  // 날짜 범위가 변경될 때 호출되는 핸들러 - 기존 코드 유지
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
    viewType, // 추가: viewType 반환
    handleViewChange,
    handleDatesSet,
  };
}
