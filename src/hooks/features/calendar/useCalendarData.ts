// src/hooks/features/calendar/useCalendarData.ts
import { useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { useGetProjectById } from '@/hooks/api/projects/useGetProjectById';
import { useGetProjectDailySchedules } from '@/hooks/api/schedule/project/useGetProjectDailySchedules';
import { useGetProjectMonthlySchedules } from '@/hooks/api/schedule/project/useGetProjectMonthlySchedules';
import { useGetProjectYearlySchedules } from '@/hooks/api/schedule/project/useGetProjectYearlySchedules';
import { useGetAllDailySchedules } from '@/hooks/api/schedule/useGetAllDailySchedules';
import { useGetAllMonthlySchedules } from '@/hooks/api/schedule/useGetAllMonthlySchedules';
import { useGetAllYearlySchedules } from '@/hooks/api/schedule/useGetAllYearlySchedules';
import { usePreviewSchedulesStore } from '@/stores/previewSchedulesStore';
import { UseCalendarDataProps } from '@/types/calendar';

export const useCalendarData = ({ projectId, currentView, currentDate }: UseCalendarDataProps) => {
  // 날짜 포맷팅
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const formattedMonth = format(currentDate, 'yyyy-MM');
  const formattedYear = format(currentDate, 'yyyy');

  // 프로젝트 정보
  const { data: projectData } = useGetProjectById(projectId as number);

  // 프로젝트 일정 데이터
  const { data: projectDailyData, isLoading: isLoadingProjectDaily } = useGetProjectDailySchedules(
    projectId as number,
    formattedDate,
    {
      enabled: !!projectId && currentView === 'day',
    }
  );

  const { data: projectMonthlyData, isLoading: isLoadingProjectMonthly } = useGetProjectMonthlySchedules(
    projectId as number,
    formattedMonth,
    {
      enabled: !!projectId && (currentView === 'week' || currentView === 'month'),
    }
  );

  const { data: projectYearlyData, isLoading: isLoadingProjectYearly } = useGetProjectYearlySchedules(
    projectId as number,
    formattedYear,
    {
      enabled: !!projectId && currentView === 'year',
    }
  );

  // 전체 일정 데이터
  const { data: allDailyData, isLoading: isLoadingAllDaily } = useGetAllDailySchedules(formattedDate, {
    enabled: !projectId && currentView === 'day',
  });

  const { data: allMonthlyData, isLoading: isLoadingAllMonthly } = useGetAllMonthlySchedules(formattedMonth, {
    enabled: !projectId && (currentView === 'week' || currentView === 'month'),
  });

  const { data: allYearlyData, isLoading: isLoadingAllYearly } = useGetAllYearlySchedules(formattedYear, {
    enabled: !projectId && currentView === 'year',
  });

  // 미리보기 이벤트
  const { previewEvents } = usePreviewSchedulesStore();

  // 이벤트 데이터 포맷팅 함수
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

  // 로딩 상태 계산
  const isCalendarDataLoading = useMemo(() => {
    if (projectId) {
      return isLoadingProjectDaily || isLoadingProjectMonthly || isLoadingProjectYearly;
    } else {
      return isLoadingAllDaily || isLoadingAllMonthly || isLoadingAllYearly;
    }
  }, [
    projectId,
    isLoadingProjectDaily,
    isLoadingProjectMonthly,
    isLoadingProjectYearly,
    isLoadingAllDaily,
    isLoadingAllMonthly,
    isLoadingAllYearly,
  ]);

  // 서버 이벤트 계산
  const serverEvents = useMemo(() => {
    if (isCalendarDataLoading) {
      return [];
    }

    if (projectId) {
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
    isCalendarDataLoading,
    projectId,
    currentView,
    projectDailyData,
    projectMonthlyData,
    projectYearlyData,
    allDailyData,
    allMonthlyData,
    allYearlyData,
    formatEventData,
  ]);

  // 최종 캘린더 이벤트 (서버 + 미리보기)
  const calendarEvents = useMemo(() => {
    return [...serverEvents, ...previewEvents];
  }, [serverEvents, previewEvents]);

  return {
    // 데이터
    projectData,
    calendarEvents,

    // 상태
    isCalendarDataLoading,

    // 포맷된 날짜들
    formattedDate,
    formattedMonth,
    formattedYear,
  };
};
