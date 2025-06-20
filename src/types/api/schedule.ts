import { EventData, Assignee } from '../calendar';
export interface ScheduleResponse {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  is_ai_recommended: boolean;
  is_project_schedule: boolean;
  start_time: string;
  end_time: string;
  color?: string;
  assignees?: Assignee[];
}

export type ScheduleOptions = {
  is_preview?: boolean;
  is_project_schedule?: boolean;
  is_ai_recommended?: boolean;
  is_completed?: boolean;
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
  projectId?: number;
  scheduleId: number;
};

// 챗봇 일정 타입
export type ChatbotCreateScheduleParams = {
  planTitle: string;
  eventDataList: EventData[];
  options?: ScheduleOptions;
};
