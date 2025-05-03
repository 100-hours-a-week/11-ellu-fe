'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import React, { useRef } from 'react';
import styles from './Calendar.module.css';

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={koLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,dayGridYear',
        }}
        views={{
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
        }}
        events={[
          { title: '회의', start: new Date().toISOString().split('T')[0] },
          // 추가 이벤트
        ]}
      />
    </div>
  );
}
