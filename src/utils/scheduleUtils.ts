import { EventData } from '@/types/calendar';
import { ScheduleResponse } from '@/types/api/schedule';

// 백엔드 응답 데이터 => FullCalendar형식으로 변환
export const convertToEventData = (scheduleResponses: ScheduleResponse[]): EventData[] => {
  return scheduleResponses.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: new Date(schedule.startTime),
    end: new Date(schedule.endTime),
    description: schedule.description || '',
    extendedProps: {
      isCompleted: schedule.isCompleted,
      isAiRecommended: schedule.isAiRecommended,
      isProjectSchedule: schedule.isProjectSchedule,
    },
  }));
};

// FullCalendar 이벤트 데이터 => API 요청 형식으로 변환
export const convertToScheduleData = (
  eventData: EventData,
  options: {
    isProjectSchedule?: boolean; // 프로젝트 스케줄 확인
    isAiRecommended?: boolean; // AI 추천 스케줄 확인
    isCompleted?: boolean; // 완료 스케줄 확인
  } = {}
): Omit<ScheduleResponse, 'id'> => {
  // 기본값
  const { isProjectSchedule = false, isAiRecommended = false, isCompleted = false } = options;

  return {
    title: eventData.title,
    description: eventData.description || null,
    isCompleted,
    isAiRecommended,
    isProjectSchedule,
    startTime: eventData.start.toISOString(),
    endTime: eventData.end.toISOString(),
  };
};
