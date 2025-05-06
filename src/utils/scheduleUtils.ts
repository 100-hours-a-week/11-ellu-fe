import { EventData } from '@/types/calendar';
import { ScheduleResponse } from '@/types/api/schedule';

// 백엔드 응답 데이터를 FullCalendar에서 사용하는 EventData 형식으로 변환하는 함수

export const convertToEventData = (scheduleResponses: ScheduleResponse[]): EventData[] => {
  return scheduleResponses.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: new Date(schedule.startTime),
    end: new Date(schedule.endTime),
    description: schedule.description || '',
    extendedProps: {
      // isCompleted: schedule.isCompleted,
      // isAiRecommended: schedule.isAiRecommended,
      isProjectSchedule: schedule.isProjectSchedule,
    },
  }));
};
