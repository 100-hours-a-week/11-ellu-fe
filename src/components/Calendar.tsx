'use client';

import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import styles from './Calendar.module.css';
import { DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleDetailModal from './ScheduleDetailModal';
import { EventData, SelectedTime } from '../types/calendar';

interface CalendarProps {
  projectId?: string;
}

const CALENDAR_VIEWS = {
  dayGridYear: {
    type: 'dayGrid',
    duration: { years: 1 },
  },
  timeGridDay: {
    type: 'timeGrid',
    duration: { days: 1 },
  },
  timeGridWeek: {
    type: 'timeGrid',
    duration: { weeks: 1 },
  },
  dayGridMonth: {
    type: 'dayGrid',
    duration: { months: 1 },
  },
};

const HEADER_TOOLBAR = {
  left: 'prev,next today',
  center: 'title',
  right: 'timeGridDay,timeGridWeek,dayGridMonth,dayGridYear',
};

export default function Calendar({ projectId }: CalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedTime | null>(null);
  const [selectedEventData, setSelectedEventData] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
  });

  // 캘린더에서 시간 선택 시 호출
  const handleSelect = (selectInfo: DateSelectArg) => {
    const { start, end } = selectInfo;
    setSelectedEvent({ start, end });
    setEventData({
      title: '',
      start,
      end,
      description: '',
    });
    setOpen(true);
  };
  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
  };
  // 모달 닫기 및 선택 취소
  const handleCancel = () => {
    setOpen(false);
    setSelectedEvent(null);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };
  // 일정 저장
  const handleSave = (newEvent: EventData) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, eventWithId];
      console.log('새로운 일정 추가:', updatedEvents);
      return updatedEvents;
    });
    handleClose();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };
  // 일정 드래그 앤 드롭 처리
  const handleEventDrop = (info: EventDropArg) => {
    const { event } = info;
    if (!event.start || !event.end) return;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((evt) => (evt.id === event.id ? { ...evt, start: event.start!, end: event.end! } : evt));
      console.log('일정 드래그 후 변경:', updatedEvents);
      return updatedEvents;
    });
  };
  // 이벤트 크기 조정
  const handleEventResize = (info: EventResizeDoneArg) => {
    const { event } = info;
    if (!event.start || !event.end) return;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((evt) => (evt.id === event.id ? { ...evt, start: event.start!, end: event.end! } : evt));
      console.log('일정 크기 조정 후 변경:', updatedEvents);
      return updatedEvents;
    });
  };
  // 일정 클릭 이벤트 처리
  const handleEventClick = (info: any) => {
    const eventData = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      description: info.event.extendedProps.description,
    };
    setSelectedEventData(eventData);
    setEditOpen(true);
  };
  // 모달 폼 입력처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedEventData(null);
  };

  const handleDelete = () => {
    if (selectedEventData) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventData.id));
      setEditOpen(false);
      setSelectedEventData(null);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={koLocale}
        headerToolbar={HEADER_TOOLBAR}
        selectable={true}
        select={handleSelect}
        unselectAuto={false}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventClick={handleEventClick}
        views={CALENDAR_VIEWS}
        events={events}
        nowIndicator={true} // 현재 시간 표시선 활성화
        slotEventOverlap={false} // 이벤트 겹침 방지 (선택사항)
      />

      <CreateScheduleModal
        open={open}
        onClose={handleClose}
        onCancel={handleCancel}
        onSave={handleSave}
        selectedEvent={selectedEvent}
        eventData={eventData}
        onInputChange={handleInputChange}
        projectId={projectId}
      />

      <ScheduleDetailModal open={editOpen} onClose={handleEditClose} eventData={selectedEventData} onDelete={handleDelete} projectId={projectId} />
    </div>
  );
}
