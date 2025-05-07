// hooks/useCalendarEvents.ts
import { useState, useCallback } from 'react';
import { EventData } from '@/types/calendar';
import { EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';

export function useCalendarEventHandlers() {
  const [events, setEvents] = useState<EventData[]>([]);

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
  const updateEvent = useCallback((info: EventDropArg | EventResizeDoneArg) => {
    const { event } = info;
    if (!event.start || !event.end) return;

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
      console.log('일정 업데이트:', updatedEvents);
      return updatedEvents;
    });
  }, []);

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
