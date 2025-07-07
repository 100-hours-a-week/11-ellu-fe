import { useState, useCallback, useMemo } from 'react';
import { EventData } from '@/types/calendar';
import { EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { useUpdateSchedule } from '@/hooks/api/schedule/useUpdateSchedule';
import { useUpdateProjectSchedule } from '@/hooks/api/schedule/project/useUpdateProjectSchedule';
import { useCreateSchedule } from '@/hooks/api/schedule/useCreateSchedule';
import { useCreateProjectSchedules } from '@/hooks/api/schedule/project/useCreateProjectSchedules';
import { UseCalendarEventHandlersProps } from '@/types/calendar';
import { useDeleteSchedule } from '@/hooks/api/schedule/useDeleteSchedule';
import { useDeleteProjectSchedule } from '@/hooks/api/schedule/project/useDeleteProjectSchedule';
import { useQueryClient } from '@tanstack/react-query';

export function useCalendarEventHandlers({
  webSocketApi,
  closeCreateModal,
  closeDetailModal,
  calendarRef,
  projectIdNumber,
  selectedEventData,
}: UseCalendarEventHandlersProps) {
  const queryClient = useQueryClient();
  const { mutate: updateScheduleMutate } = useUpdateSchedule();
  const { mutate: updateProjectScheduleMutate } = useUpdateProjectSchedule();
  const { mutate: createScheduleMutate } = useCreateSchedule();
  const { mutate: createProjectScheduleMutate } = useCreateProjectSchedules();
  const { mutate: deleteScheduleMutate } = useDeleteSchedule();
  const { mutate: deleteProjectScheduleMutate } = useDeleteProjectSchedule();

  // 일정 저장
  const saveEvent = useCallback(
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
                queryClient.invalidateQueries({ queryKey: ['user-progress'] });
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
              queryClient.invalidateQueries({ queryKey: ['user-progress'] });
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

      // 백엔드 API 호출
      if (updatedEventData.is_project_schedule) {
        // 프로젝트 일정 업데이트
        const projectId = parseInt(info.event.extendedProps.projectId || '0');

        if (webSocketApi) {
          webSocketApi.updateSchedule(updatedEventData, scheduleId as number);
        } else {
          updateProjectScheduleMutate(
            {
              projectId: projectId,
              scheduleId: scheduleId,
              eventData: updatedEventData,
              options: { is_project_schedule: true, is_completed: event.extendedProps.is_completed },
            },
            {
              onSuccess: () => {},
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
            onSuccess: () => {},
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

  // 일정 삭제
  const deleteEvent = useCallback(() => {
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
  }, [webSocketApi, projectIdNumber, deleteProjectScheduleMutate, deleteScheduleMutate]);

  return {
    saveEvent,
    updateEvent,
    deleteEvent,
  };
}
