'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
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
import { CALENDAR_VIEWS, HEADER_TOOLBAR } from '@/constants/calendarConfig';

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

import { usePreviewSchedulesStore } from '@/stores/previewSchedulesStore';

// 모달 지연로딩 처리
const CreateScheduleModal = dynamic(() => import('./CreateScheduleModal'), {
  loading: ({ isLoading = false }) => <CreateScheduleModalSkeleton open={isLoading} />,
});
const ScheduleDetailModal = dynamic(() => import('./ScheduleDetailModal'), {
  loading: ({ isLoading = false }) => <ScheduleDetailModalSkeleton open={isLoading} />,
});

export default function Calendar({ projectId }: { projectId?: string }) {
  const calendarRef = useRef<FullCalendar>(null);

  const projectIdNumber = projectId ? parseInt(projectId) : undefined;

  const webSocketApi = projectIdNumber ? useProjectWebSocket(projectIdNumber) : null;

  const { setCurrentSchedule } = useScheduleStore();
  const { previewEvents } = usePreviewSchedulesStore();

  const isPreviewMode = previewEvents.length > 0; // 또는 별도 상태

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
  const { updateEvent } = useCalendarEventHandlers({ webSocketApi });
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

  const formatEventData = useCallback((data: any[], isProject: boolean) => {
    return data.map((event) => ({
      ...event,
      id: isProject
        ? `project-${event.id}`
        : event.extendedProps?.is_project_schedule
          ? `project-${event.id}`
          : `schedule-${event.id}`,
    }));
  }, []);

  const serverEvents = useMemo(() => {
    if (projectIdNumber) {
      if (currentView === 'day' && projectDailyData) {
        return formatEventData(projectDailyData, true);
      } else if (['week', 'month'].includes(currentView) && projectMonthlyData) {
        return formatEventData(projectMonthlyData, true);
      } else if (currentView === 'year' && projectYearlyData) {
        return formatEventData(projectYearlyData, true);
      }
    } else {
      if (currentView === 'day' && allDailyData) {
        return formatEventData(allDailyData, false);
      } else if (['week', 'month'].includes(currentView) && allMonthlyData) {
        return formatEventData(allMonthlyData, false);
      } else if (currentView === 'year' && allYearlyData) {
        return formatEventData(allYearlyData, false);
      }
    }
    return [];
  }, [
    projectIdNumber,
    currentView,
    projectDailyData,
    projectMonthlyData,
    projectYearlyData,
    allDailyData,
    allMonthlyData,
    allYearlyData,
  ]);

  const calendarEvents = useMemo(() => {
    return [...serverEvents, ...previewEvents];
  }, [serverEvents, previewEvents]);

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
  }, [closeCreateModal]);

  // 일정 저장
  const handleSave = useCallback(
    (newEvent: EventData) => {
      closeCreateModal();

      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.unselect();
      }

      if (projectIdNumber) {
        // 프로젝트 일정 저장
        if (webSocketApi) {
          webSocketApi.createSchedule([newEvent], { is_project_schedule: true });
        } else {
          createProjectScheduleMutate(
            {
              projectId: projectIdNumber,
              eventDataList: [newEvent],
              options: { is_project_schedule: true },
            },
            {
              onSuccess: () => {
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
              console.log('일반 일정 생성 성공');
            },
            onError: (error) => {
              console.error('일정 저장 실패:', error);
              alert('일정 저장에 실패했습니다.');
            },
          }
        );
      }
    },
    [closeCreateModal, projectIdNumber, webSocketApi]
  );

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

  // 일정 삭제
  const handleDelete = useCallback(() => {
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
      if (webSocketApi) {
        webSocketApi.deleteSchedule(scheduleId);
        closeDetailModal();
      } else {
        deleteProjectScheduleMutate(
          {
            projectId: projectIdNumber ? projectIdNumber : 0,
            scheduleId: scheduleId,
          },
          {
            onSuccess: () => {
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
          closeDetailModal();
        },
        onError: (error) => {
          console.error('일정 삭제 실패:', error);
          alert('일정 삭제에 실패했습니다.');
        },
      });
    }
  }, [selectedEventData, webSocketApi, closeDetailModal, projectIdNumber]);

  const renderEventContent = useCallback((eventInfo: any) => {
    const isProjectSchedule = eventInfo.event.extendedProps?.is_project_schedule;
    const isCompleted = eventInfo.event.extendedProps?.is_completed;
    const backgroundColor = !isProjectSchedule
      ? eventInfo.event.extendedProps?.is_preview
        ? '#bbbbbb'
        : '#4285F4'
      : `#${eventInfo.event.extendedProps?.color}`;
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
              {assignees?.map((assignee: Assignee, index: number) => (
                <Avatar key={index} alt={assignee.nickname} src={assignee.profile_image_url} sx={{ bgcolor: 'gray' }} />
              ))}
            </AvatarGroup>
          </span>
          <div className={styles.eventBoxTime}>{eventInfo.timeText}</div>
          <div>{eventInfo.event.title}</div>
        </div>
      </div>
    );
  }, []);

  return (
    <div
      className={`${styles.calendarContainer} ${projectIdNumber ? styles.projectCalendar : styles.normalCalendar}`}
      style={projectData?.color ? ({ '--project-color': `#${projectData.color}` } as React.CSSProperties) : undefined}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
        initialView="dayGridMonth"
        locale={koLocale}
        headerToolbar={HEADER_TOOLBAR}
        selectable={true}
        select={handleSelect}
        unselectAuto={false}
        editable={!isPreviewMode}
        droppable={!isPreviewMode}
        eventDrop={updateEvent}
        eventResize={updateEvent}
        eventClick={handleEventClick}
        views={CALENDAR_VIEWS}
        events={calendarEvents}
        nowIndicator={true}
        slotEventOverlap={false}
        datesSet={handleDatesSet}
        eventContent={renderEventContent}
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
          takeSchedule={webSocketApi?.takeSchedule as (scheduleId: number) => void}
        />
      )}
    </div>
  );
}
