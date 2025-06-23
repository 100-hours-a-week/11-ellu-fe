import { useState, useCallback, useMemo } from 'react';
import { EventData } from '@/types/calendar';
import { EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { useUpdateSchedule } from '@/hooks/api/schedule/useUpdateSchedule';
import { useUpdateProjectSchedule } from '@/hooks/api/schedule/project/useUpdateProjectSchedule';
import { UseCalendarEventHandlersProps } from '@/types/calendar';
import { usePreviewSchedulesStore } from '@/stores/previewSchedulesStore';

export function useCalendarEventHandlers({ webSocketApi }: UseCalendarEventHandlersProps) {
  const { previewEvents } = usePreviewSchedulesStore();
  const [events, setEvents] = useState<EventData[]>([]);

  const { mutate: updateScheduleMutate } = useUpdateSchedule();
  const { mutate: updateProjectScheduleMutate } = useUpdateProjectSchedule();

  const displayEvents = useMemo(() => {
    return [...events, ...previewEvents];
  }, [events, previewEvents]);

  // 일정 업데이트 (드래그 앤 드롭, 리사이즈)
  const updateEvent = useCallback(
    (info: EventDropArg | EventResizeDoneArg) => {
      const { event } = info;
      if (!event.start || !event.end) return;

      let scheduleId;
      if (event.id.includes('-')) {
        const parts = event.id.split('-');
        scheduleId = parseInt(parts[parts.length - 1]);
      } else {
        scheduleId = parseInt(event.id);
      }
      if (isNaN(scheduleId)) {
        console.error('유효하지 않은 일정 ID:', event.id);
        return;
      }

      const updatedEventData = {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.extendedProps.description,
        is_project_schedule: event.extendedProps.is_project_schedule || false,
        is_completed: event.extendedProps.is_completed || false,
        is_ai_recommended: event.extendedProps.is_ai_recommended || false,
      };

      // 로컬 상태 업데이트
      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((evt) =>
          evt.id === event.id
            ? {
                ...evt,
                start: event.start!,
                end: event.end!,
                title: event.title,
                description: event.extendedProps.description,
              }
            : evt
        );
        return updatedEvents;
      });

      // 백엔드 API 호출
      if (updatedEventData.is_project_schedule) {
        // 프로젝트 일정 업데이트
        const projectId = parseInt(info.event.extendedProps.projectId || '0');

        if (webSocketApi) {
          webSocketApi.updateSchedule(updatedEventData, scheduleId as number);
        } else {
          updateProjectScheduleMutate(
            {
              projectId: projectId,
              scheduleId: scheduleId,
              eventData: updatedEventData,
              options: { is_project_schedule: true, is_completed: event.extendedProps.is_completed },
            },
            {
              onSuccess: () => {
                console.log('프로젝트 일정 업데이트 성공');
              },
              onError: (error) => {
                console.error('프로젝트 일정 업데이트 실패:', error);
                alert('일정 업데이트 실패');
              },
            }
          );
        }
      } else {
        // 일반 일정 업데이트
        updateScheduleMutate(
          {
            scheduleId: scheduleId,
            eventData: updatedEventData,
            options: { is_project_schedule: false, is_completed: event.extendedProps.is_completed },
          },
          {
            onSuccess: () => {
              console.log('일반 일정 업데이트 성공');
            },
            onError: (error) => {
              console.error('일반 일정 업데이트 실패:', error);
              alert('일정 업데이트 실패');
            },
          }
        );
      }
    },
    [updateScheduleMutate, updateProjectScheduleMutate]
  );

  return {
    events: displayEvents,
    setEvents,
    updateEvent,
  };
}
