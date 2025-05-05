'use client';

import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import koLocale from '@fullcalendar/core/locales/ko';
import styles from './Calendar.module.css';
import { EventData } from '../types/calendar';
import { useParams } from 'next/navigation';

// 상수 정의
const CALENDAR_VIEWS = {
  multiMonthYear: { type: 'multiMonth', duration: { years: 1 } },
  timeGridDay: { type: 'timeGrid', duration: { days: 1 } },
  timeGridWeek: { type: 'timeGrid', duration: { weeks: 1 } },
  dayGridMonth: { type: 'dayGrid', duration: { months: 1 } },
};

const HEADER_TOOLBAR = {
  left: 'prev,next today',
  center: 'title',
  right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear',
};

// 초기 이벤트 생성 함수
const createDefaultEvents = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return [
    {
      id: '1',
      title: '프로젝트 킥오프 미팅',
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(12, 0, 0, 0)),
      description: '새 프로젝트 시작을 위한 킥오프 미팅입니다.',
    },
    {
      id: '2',
      title: '디자인 리뷰',
      start: new Date(tomorrow.setHours(14, 0, 0, 0)),
      end: new Date(tomorrow.setHours(15, 30, 0, 0)),
      description: 'UI/UX 디자인 리뷰 세션입니다.',
    },
    {
      id: '3',
      title: '주간 스프린트 회의',
      start: new Date(nextWeek.setHours(9, 0, 0, 0)),
      end: new Date(nextWeek.setHours(10, 0, 0, 0)),
      description: '다음 주 작업 계획 및 이번 주 진행상황 점검',
    },
    {
      id: '4',
      title: '클라이언트 미팅',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 13, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 14, 30),
      description: '클라이언트와의 프로젝트 진행상황 논의',
    },
  ];
};

// 타입 정의
interface Params {
  id: string;
  [key: string]: string;
}

export default function SmallCalendar() {
  const params = useParams() as Params;
  const projectId = params.id;
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<EventData[]>([]);

  // 초기 이벤트 로딩
  useEffect(() => {
    setEvents(createDefaultEvents());

    if (projectId) {
      console.log('프로젝트 ID:', projectId);
      // 추후 API 호출로 특정 프로젝트의 일정을 로드할 수 있습니다.
      // fetchProjectEvents(projectId).then(data => setEvents(data));
    }
  }, [projectId]);

  // 이벤트 클릭 핸들러
  const handleEventClick = (info: any) => {
    console.log('선택된 이벤트:', info.event);
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin]}
        initialView="timeGridWeek"
        locale={koLocale}
        headerToolbar={HEADER_TOOLBAR}
        selectable={true}
        unselectAuto={false}
        views={CALENDAR_VIEWS}
        events={events}
        nowIndicator={true}
        slotEventOverlap={false}
        eventClick={handleEventClick}
        eventBackgroundColor="#4285F4"
        eventBorderColor="#4285F4"
        eventTextColor="#ffffff"
        height={600}
        scrollTime="09:00:00"
      />
    </div>
  );
}
