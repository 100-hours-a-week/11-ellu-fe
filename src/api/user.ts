import api from '@/config/axios';
import { User, UserProgress, UserAchievements } from '@/types/api/user';
import { ApiResponse } from '@/types/api/common';

// 닉네임 등록
export const signup = async (nickname: string): Promise<void> => {
  await api.post<ApiResponse<void>>('/auth/users/nickname', { nickname });
};

// 회원 정보 조회
export const getMyInfo = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>('/users/me');
  return res.data.data;
};

// 유저 정보 수정
export const editMyInfo = async (nickname: string): Promise<void> => {
  await api.patch<ApiResponse<void>>('/users/me', { nickname });
};

// 검색기반 닉네임 조회
export const searchUsersByNickname = async (query: string): Promise<User[]> => {
  const res = await api.get<ApiResponse<User[]>>(`/users?query=${query}`);
  return res.data.data;
};

// 유저 일정 생성기록 조회
export const getUserProgress = async (): Promise<UserProgress> => {
  const res = await api.get<ApiResponse<UserProgress>>('/achievements/daily');
  return res.data.data.map((item) => ({
    date: item.date.split('T')[0],
    created_schedules: item.created_schedules,
  }));
};

// 유저 일정 달성률 조회
export const getUserAchievements = async (): Promise<UserAchievements> => {
  const res = await api.get<ApiResponse<UserAchievements>>('/achievements/user/schedules');
  return res.data.data;
};
