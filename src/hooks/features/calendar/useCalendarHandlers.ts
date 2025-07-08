// src/hooks/features/calendar/useCalendarHandlers.ts
import { useCallback } from 'react';
import { DateSelectArg } from '@fullcalendar/core';
import { useScheduleStore } from '@/stores/scheduleStore';
import { UseCalendarHandlersProps } from '@/types/calendar';

export const useCalendarHandlers = ({
  openCreateScheduleModal,
  closeCreateModal,
  openDetailScheduleModal,
  calendarRef,
}: UseCalendarHandlersProps) => {
  const { setCurrentSchedule } = useScheduleStore();

  // 캘린더에서 시간 선택 시 호출
  const handleSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      openCreateScheduleModal(selectInfo.start, selectInfo.end);
    },
    [openCreateScheduleModal]
  );

  // 모달 취소 처리
  const handleCancel = useCallback(() => {
    closeCreateModal();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  }, [closeCreateModal, calendarRef]);

  // 일정 클릭 이벤트 처리
  const handleEventClick = useCallback(
    (info: any) => {
      const eventData = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        description: info.event.extendedProps.description || '',
        is_completed: info.event.extendedProps.is_completed || false,
        is_ai_recommended: info.event.extendedProps.is_ai_recommended || false,
        is_project_schedule: info.event.extendedProps.is_project_schedule || false,
        assignees: info.event.extendedProps.assignees || [],
      };
      setCurrentSchedule(eventData);
      openDetailScheduleModal(eventData);
    },
    [openDetailScheduleModal, setCurrentSchedule]
  );

  return {
    handleSelect,
    handleCancel,
    handleEventClick,
  };
};
