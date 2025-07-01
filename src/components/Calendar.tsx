'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import styles from './Calendar.module.css';
import { useCalendarModals } from '@/hooks/features/calendar/useCalendarModals';
import { useCalendarEventHandlers } from '@/hooks/features/calendar/useCalendarEvents';
import { useCalendarView } from '@/hooks/features/calendar/useCalendarView';
import { useCalendarHandlers } from '@/hooks/features/calendar/useCalendarHandlers';
import { useCalendarData } from '@/hooks/features/calendar/useCalendarData';
import { Assignee } from '@/types/calendar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Avatar, AvatarGroup, CircularProgress } from '@mui/material';
import { CALENDAR_VIEWS, HEADER_TOOLBAR } from '@/constants/calendarConfig';

import CreateScheduleModalSkeleton from './skeleton/CreateScheduleModalSkeleton';
import ScheduleDetailModalSkeleton from './skeleton/ScheduleDetailModalSkeleton';

import { useProjectWebSocket } from '@/hooks/integration/useProjectWebSocket';

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
  const pathname = usePathname();

  const projectIdNumber = projectId ? parseInt(projectId) : undefined;

  const webSocketApi = projectIdNumber ? useProjectWebSocket(projectIdNumber) : null;

  const { previewEvents } = usePreviewSchedulesStore();

  const isPreviewMode = pathname.includes('/chatbot') && previewEvents.length > 0;

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

  const { saveEvent, updateEvent, deleteEvent } = useCalendarEventHandlers({
    webSocketApi,
    closeCreateModal,
    closeDetailModal,
    calendarRef,
    projectIdNumber,
    selectedEventData,
  });

  const { currentView, currentDate, handleDatesSet } = useCalendarView();

  const { handleSelect, handleCancel, handleEventClick } = useCalendarHandlers({
    openCreateScheduleModal,
    closeCreateModal,
    openDetailScheduleModal,
    calendarRef,
  });

  const { projectData, calendarEvents, isCalendarDataLoading } = useCalendarData({
    projectId: projectIdNumber,
    currentView,
    currentDate,
  });

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
      {isCalendarDataLoading ? (
        <div
          style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CircularProgress sx={{ scale: '1.5' }} />
        </div>
      ) : (
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
      )}

      {openCreateModal && (
        <CreateScheduleModal
          open={openCreateModal}
          onClose={closeCreateModal}
          onCancel={handleCancel}
          onSave={saveEvent}
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
          onDelete={deleteEvent}
          projectId={projectId}
          takeSchedule={webSocketApi?.takeSchedule as (scheduleId: number) => void}
        />
      )}
    </div>
  );
}
