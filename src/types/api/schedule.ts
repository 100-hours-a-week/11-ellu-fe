import { EventData } from "../calendar";
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

export type ScheduleOptions = {
  isProjectSchedule?: boolean;
  isAiRecommended?: boolean;
  isCompleted?: boolean;
};

export type CreateScheduleParams = {
  eventData: EventData;
  options?: ScheduleOptions;
};

export type UpdateScheduleParams = {
  scheduleId: number;
  eventData: EventData;
  options?: ScheduleOptions;
};

// 프로젝트 일정 타입
export type CreateProjectSchedulesParams = {
  projectId: number;
  eventDataList: EventData[];
  options?: ScheduleOptions;
};

export type UpdateProjectScheduleParams = {
  projectId: number;
  scheduleId: number;
  eventData: EventData;
  options?: ScheduleOptions;
};

export type DeleteProjectScheduleParams = {
  projectId: number;
  scheduleId: number;
};
