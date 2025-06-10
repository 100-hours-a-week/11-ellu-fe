'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { format } from 'date-fns';
import styles from './Calendar.module.css';
import { DateSelectArg } from '@fullcalendar/core';
import { useCalendarModals } from '@/hooks/useCalendarModals';
import { useCalendarEventHandlers } from '@/hooks/useCalendarEvents';
import { useCalendarView } from '@/hooks/useCalendarView';
import { EventData, Assignee } from '@/types/calendar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Avatar, AvatarGroup } from '@mui/material';

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

import CreateScheduleModalSkeleton from './skeleton/CreateScheduleModalSkeleton';
import ScheduleDetailModalSkeleton from './skeleton/ScheduleDetailModalSkeleton';

import { useScheduleStore } from '@/stores/scheduleStore';
import { useGetProjectById } from '@/hooks/api/projects/useGetProjectById';

import { useProjectWebSocket } from '@/hooks/websocket/useProjectWebSocket';

// 모달 지연로딩 처리
const CreateScheduleModal = dynamic(() => import('./CreateScheduleModal'), {
  loading: ({ isLoading = false }) => <CreateScheduleModalSkeleton open={isLoading} />,
});
const ScheduleDetailModal = dynamic(() => import('./ScheduleDetailModal'), {
  loading: ({ isLoading = false }) => <ScheduleDetailModalSkeleton open={isLoading} />,
});

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
  const queryClient = useQueryClient();
  const calendarRef = useRef<FullCalendar>(null);

  const projectIdNumber = projectId ? parseInt(projectId) : undefined;

  const webSocketAPI = projectIdNumber ? useProjectWebSocket(projectIdNumber) : null;

  const { setCurrentSchedule } = useScheduleStore();

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
  const { events, setEvents, createEvent, updateEvent, deleteEvent } = useCalendarEventHandlers({ webSocketAPI });
  const { currentView, currentDate, handleDatesSet } = useCalendarView();

  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const formattedMonth = format(currentDate, 'yyyy-MM');
  const formattedYear = format(currentDate, 'yyyy');

  // tanstack query
  // 프로젝트 정보 가져오기
  const { data: projectData, isLoading: isLoadingProject } = useGetProjectById(projectIdNumber as number);
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
  // 일정 삭제
  const { mutate: deleteScheduleMutate } = useDeleteSchedule();

  const formatEventData = (data: any[], isProject: boolean) => {
    return data.map((event) => ({
      ...event,
      id: isProject
        ? `project-${event.id}`
        : event.extendedProps?.is_project_schedule
          ? `project-${event.id}`
          : `schedule-${event.id}`,
    }));
  };

  useEffect(() => {
    if (projectIdNumber) {
      // 프로젝트 일정
      if (currentView === 'day' && projectDailyData) {
        const formattedData = formatEventData(projectDailyData, true);
        console.log('프로젝트 일별 일정 데이터:', formattedData);
        setEvents(formattedData);
      } else if ((currentView === 'week' || currentView === 'month') && projectMonthlyData) {
        const formattedData = formatEventData(projectMonthlyData, true);
        console.log('프로젝트 주간/월간 일정 데이터:', formattedData);
        setEvents(formattedData);
      } else if (currentView === 'year' && projectYearlyData) {
        const formattedData = formatEventData(projectYearlyData, true);
        console.log('프로젝트 연간 일정 데이터:', formattedData);
        setEvents(formattedData);
      }
    } else {
      // 전체 일정
      if (currentView === 'day' && allDailyData) {
        const formattedData = formatEventData(allDailyData, false);
        console.log('전체 일별 일정 데이터:', formattedData);
        setEvents(formattedData);
      } else if ((currentView === 'week' || currentView === 'month') && allMonthlyData) {
        const formattedData = formatEventData(allMonthlyData, false);
        console.log('전체 주간/월간 일정 데이터:', formattedData);
        setEvents(formattedData);
      } else if (currentView === 'year' && allYearlyData) {
        const formattedData = formatEventData(allYearlyData, false);
        console.log('전체 연간 일정 데이터:', formattedData);
        setEvents(formattedData);
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
    closeCreateModal();

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }

    if (projectIdNumber) {
      // 프로젝트 일정 저장
      if (webSocketAPI) {
        webSocketAPI.createSchedule([newEvent], { is_project_schedule: true });
      } else {
        createProjectScheduleMutate(
          {
            projectId: projectIdNumber,
            eventDataList: [newEvent],
            options: { is_project_schedule: true },
          },
          {
            onSuccess: () => {
              createEvent({
                ...newEvent,
                is_project_schedule: true,
              });
              console.log('프로젝트 일정 생성 성공');
            },
            onError: (error) => {
              console.error('일정 저장 실패:', error);
              alert('일정 저장에 실패했습니다.');
            },
          }
        );
      }
    } else {
      // 일반 일정 저장
      createScheduleMutate(
        {
          eventData: newEvent,
          options: { is_project_schedule: false },
        },
        {
          onSuccess: () => {
            createEvent({
              ...newEvent,
              is_project_schedule: false,
            });
            console.log('일반 일정 생성 성공');
          },
          onError: (error) => {
            console.error('일정 저장 실패:', error);
            alert('일정 저장에 실패했습니다.');
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
      description: info.event.extendedProps.description || '',
      is_completed: info.event.extendedProps.is_completed || false,
      is_ai_recommended: info.event.extendedProps.is_ai_recommended || false,
      is_project_schedule: info.event.extendedProps.is_project_schedule || false,
      assignees: info.event.extendedProps.assignees || [],
    };
    setCurrentSchedule(eventData);
    openDetailScheduleModal(eventData);
  };

  // 일정 삭제
  const handleDelete = () => {
    console.log('일정삭제:', selectedEventData);
    if (!selectedEventData || !selectedEventData.id) {
      return;
    }

    let scheduleId;
    if (selectedEventData.id.includes('-')) {
      const parts = selectedEventData.id.split('-');
      scheduleId = parseInt(parts[parts.length - 1]);
    } else {
      scheduleId = parseInt(selectedEventData.id);
    }
    if (isNaN(scheduleId)) {
      console.error('유효하지 않은 일정 ID:', selectedEventData.id);
      return;
    }

    if (selectedEventData.is_project_schedule) {
      // 프로젝트 일정 삭제
      if (webSocketAPI) {
        webSocketAPI.deleteSchedule(scheduleId);
        closeDetailModal();
      } else {
        deleteProjectScheduleMutate(
          {
            projectId: projectIdNumber ? projectIdNumber : 0,
            scheduleId: scheduleId,
          },
          {
            onSuccess: () => {
              deleteEvent(selectedEventData.id as string);
              closeDetailModal();
            },
            onError: (error) => {
              console.error('일정 삭제 실패:', error);
              alert('일정 삭제에 실패했습니다.');
            },
          }
        );
      }
    } else {
      // 일반 일정 삭제
      deleteScheduleMutate(scheduleId, {
        onSuccess: () => {
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

  // 뷰 변경 시 이벤트 데이터 초기화 및 새로 불러오기
  const handleViewChange = useCallback(
    (dateInfo: any) => {
      handleDatesSet(dateInfo);
      setEvents([]);

      if (projectIdNumber) {
        if (dateInfo.view.type === 'timeGridDay') {
          queryClient.invalidateQueries({
            queryKey: ['project-daily-schedules', projectIdNumber, format(dateInfo.start, 'yyyy-MM-dd')],
          });
        } else if (dateInfo.view.type === 'timeGridWeek' || dateInfo.view.type === 'dayGridMonth') {
          queryClient.invalidateQueries({
            queryKey: ['project-monthly-schedules', projectIdNumber, format(dateInfo.start, 'yyyy-MM')],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ['project-yearly-schedules', projectIdNumber, format(dateInfo.start, 'yyyy')],
          });
        }
      } else {
        if (dateInfo.view.type === 'timeGridDay') {
          queryClient.invalidateQueries({
            queryKey: ['daily-schedules', format(dateInfo.start, 'yyyy-MM-dd')],
          });
        } else if (dateInfo.view.type === 'timeGridWeek' || dateInfo.view.type === 'dayGridMonth') {
          queryClient.invalidateQueries({
            queryKey: ['monthly-schedules', format(dateInfo.start, 'yyyy-MM')],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ['yearly-schedules', format(dateInfo.start, 'yyyy')],
          });
        }
      }
    },
    [handleDatesSet, projectIdNumber, queryClient, setEvents]
  );

  return (
    <div
      className={`${styles.calendarContainer} ${projectIdNumber ? styles.projectCalendar : styles.normalCalendar}`}
      style={projectData?.color ? ({ '--project-color': `#${projectData.color}` } as React.CSSProperties) : undefined}
    >
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
        datesSet={handleViewChange}
        eventContent={(eventInfo) => {
          const isProjectSchedule = eventInfo.event.extendedProps?.is_project_schedule;
          const isCompleted = eventInfo.event.extendedProps?.is_completed;
          const backgroundColor = !isProjectSchedule ? '#4285F4' : `#${eventInfo.event.extendedProps?.color}`;
          const assignees = eventInfo.event.extendedProps?.assignees;

          return (
            <div
              style={{
                backgroundColor,
                color: '#ffffff',
                padding: '0 2px',
                borderRadius: '3px',
                width: '100%',
                height: '100%',
              }}
            >
              <div className={styles.eventBox}>
                <span className={styles.eventBoxIcon}>
                  {isCompleted ? <CheckCircleIcon className={styles.smallIcon} /> : null}
                  <AvatarGroup
                    spacing="small"
                    max={3}
                    sx={{
                      '& .MuiAvatarGroup-avatar': {
                        width: 20,
                        height: 20,
                        fontSize: '0.75rem',
                      },
                    }}
                  >
                    {assignees?.map((assignee: Assignee) => (
                      <Avatar alt={assignee.nickname} src={assignee.profile_image_url} sx={{ bgcolor: 'gray' }} />
                    ))}
                  </AvatarGroup>
                </span>
                <div className={styles.eventBoxTime}>{eventInfo.timeText}</div>
                <div>{eventInfo.event.title}</div>
              </div>
            </div>
          );
        }}
      />

      {openCreateModal && (
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
      )}

      {openDetailModal && (
        <ScheduleDetailModal
          open={openDetailModal}
          onClose={closeDetailModal}
          eventData={selectedEventData}
          onDelete={handleDelete}
          projectId={projectId}
          takeSchedule={webSocketAPI?.takeSchedule as (scheduleId: number) => void}
        />
      )}
    </div>
  );
}
