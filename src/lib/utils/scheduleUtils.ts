import { EventData, Assignee } from '@/types/calendar';
import { ScheduleResponse } from '@/types/api/schedule';
import { changeTime } from './changeTime';

// 백엔드 응답 데이터 => FullCalendar형식으로 변환
export const convertToEventData = (scheduleResponses: ScheduleResponse[]): EventData[] => {
  return scheduleResponses.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: new Date(schedule.start_time),
    end: new Date(schedule.end_time),
    description: schedule.description || '',
    extendedProps: {
      is_completed: schedule.is_completed,
      is_ai_recommended: schedule.is_ai_recommended,
      is_project_schedule: schedule.is_project_schedule,
      color: schedule.color,
    },
    assignees: schedule.assignees?.map((a) => ({ nickname: a.nickname, profile_image_url: a.profile_image_url })),
  }));
};

// FullCalendar 이벤트 데이터 => API 요청 형식으로 변환
export const convertToScheduleData = (
  eventData: EventData,
  options: {
    is_project_schedule?: boolean; // 프로젝트 스케줄 확인
    is_ai_recommended?: boolean; // AI 추천 스케줄 확인
    is_completed?: boolean; // 완료 스케줄 확인
  } = {}
): Omit<ScheduleResponse, 'id'> => {
  // 기본값
  const { is_project_schedule = false, is_ai_recommended = false, is_completed = false } = options;

  return {
    title: eventData.title,
    description: eventData.description || null,
    is_completed,
    is_ai_recommended,
    is_project_schedule,
    start_time: changeTime(eventData.start),
    end_time: changeTime(eventData.end),
  };
};

// FullCalendar 이벤트 데이터 => 챗봇 API 요청 형식으로 변환
export const convertToChatbotScheduleData = (
  eventData: EventData
): Omit<ScheduleResponse, 'id' | 'description' | 'is_completed' | 'is_ai_recommended' | 'is_project_schedule'> => {
  return {
    title: eventData.title,
    start_time: changeTime(eventData.start),
    end_time: changeTime(eventData.end),
  };
};
