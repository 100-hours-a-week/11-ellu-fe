export interface ScheduleResponse {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  isAiRecommended: boolean;
  isProjectSchedule: boolean;
  startTime: string;
  endTime: string;
}
