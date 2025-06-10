import { useState, useCallback } from 'react';
import { EventData } from '@/types/calendar';
import { EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { useUpdateSchedule } from '@/hooks/api/schedule/useUpdateSchedule';
import { useUpdateProjectSchedule } from '@/hooks/api/schedule/project/useUpdateProjectSchedule';

import { useProjectWebSocket } from '@/hooks/websocket/useProjectWebSocket';

// WebSocket API 인터페이스 타입 정의
interface webSocketAPI {
  updateSchedule: (eventData: EventData, scheduleId: number) => void;
}
interface UseCalendarEventHandlersProps {
  webSocketAPI?: webSocketAPI | null;
}

export function useCalendarEventHandlers({ webSocketAPI }: UseCalendarEventHandlersProps) {
  const [events, setEvents] = useState<EventData[]>([]);

  const { mutate: updateScheduleMutate } = useUpdateSchedule();
  const { mutate: updateProjectScheduleMutate } = useUpdateProjectSchedule();

  // 일정 생성
  const createEvent = useCallback((newEvent: EventData) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, eventWithId];
      console.log('새로운 일정 추가:', updatedEvents);
      return updatedEvents;
    });
    return eventWithId;
  }, []);

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

        if (webSocketAPI) {
          webSocketAPI.updateSchedule(updatedEventData, scheduleId as number);
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

  // 특정 일정 업데이트
  const updateSpecificEvent = useCallback((updatedEvent: EventData) => {
    if (!updatedEvent.id) return;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt));
      console.log('일정 업데이트:', updatedEvents);
      return updatedEvents;
    });
  }, []);

  // 일정 삭제
  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prevEvents) => {
      const filteredEvents = prevEvents.filter((event) => event.id !== eventId);
      console.log('일정 삭제 후:', filteredEvents);
      return filteredEvents;
    });
  }, []);

  return {
    events,
    setEvents,
    createEvent,
    updateEvent,
    updateSpecificEvent,
    deleteEvent,
  };
}
