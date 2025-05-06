import api from '@/lib/axios';
import { ScheduleResponse } from '@/types/api/schedule';
import { EventData } from '@/types/calendar';
import { ApiResponse } from '@/types/api/common';
import { convertToEventData } from '@/utils/scheduleUtils';

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

////////////////////프로젝트////////////////////

// 특정 프로젝트 일별 일정조회
export const getProjectDailySchedules = async (projectId: string, date: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules/daily`, {
    params: { date },
  });
  return convertToEventData(res.data.data);
};

// 특정 프로젝트 (주,월)별 일정조회
export const getProjectMonthlySchedules = async (projectId: string, month: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules/monthly`, {
    params: { month },
  });
  return convertToEventData(res.data.data);
};

// 특정 프로젝트 연별 일정조회
export const getProjectYearlySchedules = async (projectId: string, year: string): Promise<EventData[]> => {
  const res = await api.get<ApiResponse<ScheduleResponse[]>>(`/projects/${projectId}/schedules/yearly`, {
    params: { year },
  });
  return convertToEventData(res.data.data);
};
