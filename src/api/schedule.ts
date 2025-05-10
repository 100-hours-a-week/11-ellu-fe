import api from '@/lib/axios';
import { ScheduleResponse } from '@/types/api/schedule';
import { EventData } from '@/types/calendar';
import { ApiResponse } from '@/types/api/common';
import { convertToEventData, convertToScheduleData } from '@/utils/scheduleUtils';

////////////////////모든일정////////////////////

// 일별 전체 일정조회
export const getAllDailySchedules = async (date: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/user/schedules/daily`, {
    params: { date },
  });
  return convertToEventData(res.data.data);
};

// (주,월)별 전체 일정조회
export const getAllMonthlySchedules = async (month: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/user/schedules/monthly`, {
    params: { month },
  });
  return convertToEventData(res.data.data);
};

// 연별 전체 일정조회
export const getAllYearlySchedules = async (year: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/user/schedules/yearly`, {
    params: { year },
  });
  return convertToEventData(res.data.data);
};

// 일정 생성
export const createSchedule = async (
  eventData: EventData,
  options: {
    is_project_schedule?: boolean;
    is_ai_recommended?: boolean;
    is_completed?: boolean;
  } = {}
): Promise<void> => {
  const scheduleData = convertToScheduleData(eventData, options);
  await api.post<ApiResponse<ScheduleResponse>>('/user/schedules', scheduleData);
};

// 일정 수정
export const updateSchedule = async (
  scheduleId: number,
  eventData: EventData,
  options: {
    is_project_schedule?: boolean;
    is_ai_recommended?: boolean;
    is_completed?: boolean;
  } = {}
): Promise<void> => {
  const scheduleData = convertToScheduleData(eventData, options);
  await api.patch<ApiResponse<ScheduleResponse>>(`/user/schedules/${scheduleId}`, scheduleData);
};

// 일정 삭제
export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/user/schedules/${scheduleId}`);
};

////////////////////프로젝트////////////////////

// 특정 프로젝트 일별 일정조회
export const getProjectDailySchedules = async (projectId: number, day: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules/daily`, {
    params: { day },
  });
  return convertToEventData(res.data.data);
};

// 특정 프로젝트 (주,월)별 일정조회
export const getProjectMonthlySchedules = async (projectId: number, month: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules/monthly`, {
    params: { month },
  });
  return convertToEventData(res.data.data);
};

// 특정 프로젝트 연별 일정조회
export const getProjectYearlySchedules = async (projectId: number, year: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules/yearly`, {
    params: { year },
  });
  return convertToEventData(res.data.data);
};

// 프로젝트 일정 생성
export const createProjectSchedules = async (
  projectId: number,
  eventDataList: EventData[],
  options: {
    is_project_schedule?: boolean;
    is_ai_recommended?: boolean;
    is_completed?: boolean;
  } = {}
): Promise<void> => {
  const scheduleDataList = eventDataList.map((eventData) => convertToScheduleData(eventData, options));
  await api.post<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules`, {
    project_schedules: scheduleDataList,
  });
};

// 프로젝트 일정 수정
export const updateProjectSchedule = async (
  projectId: number,
  scheduleId: number,
  eventData: EventData,
  options: {
    is_project_schedule?: boolean;
    is_ai_recommended?: boolean;
    is_completed?: boolean;
  } = {}
): Promise<void> => {
  const scheduleData = convertToScheduleData(eventData, options);
  await api.patch<ApiResponse<ScheduleResponse>>(`/projects/schedules/${scheduleId}`, scheduleData);
};

// 프로젝트 일정 삭제
export const deleteProjectSchedule = async (scheduleId: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/projects/schedules/${scheduleId}`);
};
