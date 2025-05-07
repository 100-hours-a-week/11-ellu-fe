// components/Calendar.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { format } from 'date-fns';
import styles from './Calendar.module.css';
import { DateSelectArg } from '@fullcalendar/core';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleDetailModal from './ScheduleDetailModal';
import { useCalendarModals } from '@/hooks/useCalendarModals';
import { useCalendarEventHandlers } from '@/hooks/useCalendarEvents';
import { useCalendarView } from '@/hooks/useCalendarView';
import { EventData } from '@/types/calendar';

import { useGetProjectDailySchedules } from '@/hooks/api/schedule/project/useGetProjectDailySchedules';
import { useGetProjectMonthlySchedules } from '@/hooks/api/schedule/project/useGetProjectMonthlySchedules';
import { useGetProjectYearlySchedules } from '@/hooks/api/schedule/project/useGetProjectYearlySchedules';
import { useCreateProjectSchedules } from '@/hooks/api/schedule/project/useCreateProjectSchedules';

import { useGetAllDailySchedules } from '@/hooks/api/schedule/useGetAllDailySchedules';
import { useCreateSchedule } from '@/hooks/api/schedule/useCreateSchedule';

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

export default function Calendar({ projectId }: { projectId?: string }) {
  const calendarRef = useRef<FullCalendar>(null);

  const projectIdNumber = projectId ? parseInt(projectId) : undefined;

  // 커스텀 훅 사용
  const {
    openCreateModal,
    openDetailModal,
    selectedEvent,
    selectedEventData,
    eventData,
    openCreateScheduleModal,
    closeCreateModal,
    openDetailScheduleModal,
    closeDetailModal,
    handleInputChange,
  } = useCalendarModals();
  const { events, setEvents, createEvent, updateEvent, deleteEvent } = useCalendarEventHandlers();
  const { currentView, currentDate, viewType, handleViewChange, handleDatesSet } = useCalendarView();

  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const formattedMonth = format(currentDate, 'yyyy-MM');
  const formattedYear = format(currentDate, 'yyyy');

  // tanstack query
  // 프로젝트 일정
  const { data: projectDailyData, isLoading: isLoadingProjectDaily } = useGetProjectDailySchedules(
    projectIdNumber as number,
    formattedDate,
    {
      enabled: !!projectIdNumber && viewType === 'day',
    }
  );
  const { data: projectMonthlyData, isLoading: isLoadingProjectMonthly } = useGetProjectMonthlySchedules(
    projectIdNumber as number,
    formattedMonth,
    {
      enabled: !!projectIdNumber && (viewType === 'week' || viewType === 'month'),
    }
  );
  const { data: projectYearlyData, isLoading: isLoadingProjectYearly } = useGetProjectYearlySchedules(
    projectIdNumber as number,
    formattedYear,
    {
      enabled: !!projectIdNumber && viewType === 'year',
    }
  );
  const { mutate: createProjectScheduleMutate } = useCreateProjectSchedules();

  // 모든일정
  const { data: allDailyData, isLoading: isLoadingAllDaily } = useGetAllDailySchedules(formattedDate, {
    enabled: !projectIdNumber && viewType === 'day',
  });
  const { mutate: createScheduleMutate } = useCreateSchedule();

  useEffect(() => {
    console.log('여기~~~', formattedDate, currentView);

    if (projectIdNumber) {
      // 프로젝트 일정 (이미 구현한 부분)
      if (viewType === 'day' && projectDailyData) {
        console.log('프로젝트 일별 뷰: 일별 데이터를 로드합니다', projectDailyData);
        setEvents(projectDailyData);
      } else if ((viewType === 'week' || viewType === 'month') && projectMonthlyData) {
        console.log('프로젝트 주간/월간 뷰: 월별 데이터를 로드합니다', projectMonthlyData);
        setEvents(projectMonthlyData);
      } else if (viewType === 'year' && projectYearlyData) {
        console.log('프로젝트 연간 뷰: 연간 데이터를 로드합니다', projectYearlyData);
        setEvents(projectYearlyData);
      }
    } else {
      // 전체 일정
      if (viewType === 'day' && allDailyData) {
        console.log('전체 일별 뷰: 일별 데이터를 로드합니다', allDailyData);
        setEvents(allDailyData);
      } else if (viewType === 'week' || viewType === 'month') {
        console.log('전체 주간/월간 뷰: 월별 데이터를 가져와야 합니다');
        // 전체 월별 일정 데이터 로드 로직은 아직 구현하지 않음
      } else if (viewType === 'year') {
        console.log('전체 연간 뷰: 연간 데이터를 가져와야 합니다');
        // 전체 연간 일정 데이터 로드 로직은 아직 구현하지 않음
      }
    }
  }, [
    viewType,
    currentDate,
    projectDailyData,
    projectMonthlyData,
    projectYearlyData,
    allDailyData,
    projectIdNumber,
    setEvents,
  ]);

  // 캘린더에서 시간 선택 시 호출
  const handleSelect = (selectInfo: DateSelectArg) => {
    openCreateScheduleModal(selectInfo.start, selectInfo.end);
  };

  // 모달 취소 처리
  const handleCancel = () => {
    closeCreateModal();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };

  // 일정 저장
  const handleSave = (newEvent: EventData) => {
    // 로컬 상태 먼저 업데이트 (UI에 바로 반영)
    const createdEvent = createEvent(newEvent);
    closeCreateModal();

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }

    // 프로젝트 ID 유무에 따라 다른 API 호출
    if (projectIdNumber) {
      // 프로젝트 일정 저장 (이전에 구현한 부분)
      console.log('프로젝트 일정 생성:', newEvent);
      createProjectScheduleMutate(
        {
          projectId: projectIdNumber,
          eventDataList: [newEvent],
          options: { isProjectSchedule: true },
        },
        {
          onSuccess: () => {
            console.log('프로젝트 일정 생성 성공');
          },
          onError: (error) => {
            console.error('일정 저장 실패:', error);
            alert('일정 저장에 실패했습니다.');
            if (createdEvent.id) {
              deleteEvent(createdEvent.id);
            }
          },
        }
      );
    } else {
      // 일반 일정 저장 (새로 추가하는 부분)
      console.log('일반 일정 생성:', newEvent);
      createScheduleMutate(
        {
          eventData: newEvent,
          options: {},
        },
        {
          onSuccess: () => {
            console.log('일반 일정 생성 성공');
          },
          onError: (error) => {
            console.error('일정 저장 실패:', error);
            alert('일정 저장에 실패했습니다.');
            if (createdEvent.id) {
              deleteEvent(createdEvent.id);
            }
          },
        }
      );
    }
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
    openDetailScheduleModal(eventData);
  };

  // 일정 삭제
  const handleDelete = () => {
    if (selectedEventData?.id) {
      deleteEvent(selectedEventData.id);
      closeDetailModal();
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
        initialView="timeGridWeek"
        locale={koLocale}
        headerToolbar={HEADER_TOOLBAR}
        selectable={true}
        select={handleSelect}
        unselectAuto={false}
        editable={true}
        droppable={true}
        eventDrop={updateEvent}
        eventResize={updateEvent}
        eventClick={handleEventClick}
        views={CALENDAR_VIEWS}
        events={events}
        nowIndicator={true}
        slotEventOverlap={false}
        viewDidMount={handleViewChange}
        datesSet={handleDatesSet}
      />

      <CreateScheduleModal
        open={openCreateModal}
        onClose={closeCreateModal}
        onCancel={handleCancel}
        onSave={handleSave}
        selectedEvent={selectedEvent}
        eventData={eventData}
        onInputChange={handleInputChange}
        projectId={projectId}
      />

      <ScheduleDetailModal
        open={openDetailModal}
        onClose={closeDetailModal}
        eventData={selectedEventData}
        onDelete={handleDelete}
        projectId={projectId}
      />
    </div>
  );
}
