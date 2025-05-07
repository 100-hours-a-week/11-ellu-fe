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
import { useDeleteProjectSchedule } from '@/hooks/api/schedule/project/useDeleteProjectSchedule';

import { useGetAllDailySchedules } from '@/hooks/api/schedule/useGetAllDailySchedules';
import { useGetAllMonthlySchedules } from '@/hooks/api/schedule/useGetAllMonthlySchedules';
import { useGetAllYearlySchedules } from '@/hooks/api/schedule/useGetAllYearlySchedules';
import { useCreateSchedule } from '@/hooks/api/schedule/useCreateSchedule';
import { useDeleteSchedule } from '@/hooks/api/schedule/useDeleteSchedule';

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
  const { currentView, currentDate, handleDatesSet } = useCalendarView();

  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const formattedMonth = format(currentDate, 'yyyy-MM');
  const formattedYear = format(currentDate, 'yyyy');

  // tanstack query
  // 프로젝트
  // 일별 일정
  const { data: projectDailyData, isLoading: isLoadingProjectDaily } = useGetProjectDailySchedules(
    projectIdNumber as number,
    formattedDate,
    {
      enabled: !!projectIdNumber && currentView === 'day',
    }
  );
  // 주간/월간 일정
  const { data: projectMonthlyData, isLoading: isLoadingProjectMonthly } = useGetProjectMonthlySchedules(
    projectIdNumber as number,
    formattedMonth,
    {
      enabled: !!projectIdNumber && (currentView === 'week' || currentView === 'month'),
    }
  );
  // 연간 일정
  const { data: projectYearlyData, isLoading: isLoadingProjectYearly } = useGetProjectYearlySchedules(
    projectIdNumber as number,
    formattedYear,
    {
      enabled: !!projectIdNumber && currentView === 'year',
    }
  );
  // 일정 생성
  const { mutate: createProjectScheduleMutate } = useCreateProjectSchedules();
  // 일정 수정
  // 일정 삭제
  const { mutate: deleteProjectScheduleMutate } = useDeleteProjectSchedule();

  // 모든일정
  // 일별 일정
  const { data: allDailyData, isLoading: isLoadingAllDaily } = useGetAllDailySchedules(formattedDate, {
    enabled: !projectIdNumber && currentView === 'day',
  });
  // 주간/월간 일정
  const { data: allMonthlyData, isLoading: isLoadingAllMonthly } = useGetAllMonthlySchedules(formattedMonth, {
    enabled: !projectIdNumber && (currentView === 'week' || currentView === 'month'),
  });
  // 연간 일정
  const { data: allYearlyData, isLoading: isLoadingAllYearly } = useGetAllYearlySchedules(formattedYear, {
    enabled: !projectIdNumber && currentView === 'year',
  });
  // 일정 생성
  const { mutate: createScheduleMutate } = useCreateSchedule();
  // 일정 수정
  // 일정 삭제
  const { mutate: deleteScheduleMutate } = useDeleteSchedule();

  useEffect(() => {
    console.log('여기~~~', formattedDate, currentView);

    if (projectIdNumber) {
      // 프로젝트 일정
      if (currentView === 'day' && projectDailyData) {
        setEvents(projectDailyData);
      } else if ((currentView === 'week' || currentView === 'month') && projectMonthlyData) {
        setEvents(projectMonthlyData);
      } else if (currentView === 'year' && projectYearlyData) {
        setEvents(projectYearlyData);
      }
    } else {
      // 전체 일정
      if (currentView === 'day' && allDailyData) {
        setEvents(allDailyData);
      } else if ((currentView === 'week' || currentView === 'month') && allMonthlyData) {
        setEvents(allMonthlyData);
      } else if (currentView === 'year' && allYearlyData) {
        setEvents(allYearlyData);
      }
    }
  }, [
    currentView,
    currentDate,
    projectDailyData,
    projectMonthlyData,
    projectYearlyData,
    allDailyData,
    allMonthlyData,
    allYearlyData,
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
    const createdEvent = createEvent(newEvent);
    closeCreateModal();

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }

    if (projectIdNumber) {
      // 프로젝트 일정 저장
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
      // 일반 일정 저장
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
    if (!selectedEventData || !selectedEventData.id) {
      return;
    }
    const scheduleId = parseInt(selectedEventData.id);
    if (isNaN(scheduleId)) {
      console.error('유효하지 않은 일정 ID:', selectedEventData.id);
      return;
    }

    if (projectIdNumber) {
      // 프로젝트 일정 삭제
      deleteProjectScheduleMutate(
        {
          projectId: projectIdNumber,
          scheduleId: scheduleId,
        },
        {
          onSuccess: () => {
            console.log('프로젝트 일정 삭제 성공:', scheduleId);
            deleteEvent(selectedEventData.id as string);
            closeDetailModal();
          },
          onError: (error) => {
            console.error('일정 삭제 실패:', error);
            alert('일정 삭제에 실패했습니다.');
          },
        }
      );
    } else {
      // 일반 일정 삭제
      deleteScheduleMutate(scheduleId, {
        onSuccess: () => {
          console.log('일반 일정 삭제 성공:', scheduleId);
          deleteEvent(selectedEventData.id as string);
          closeDetailModal();
        },
        onError: (error) => {
          console.error('일정 삭제 실패:', error);
          alert('일정 삭제에 실패했습니다.');
        },
      });
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
