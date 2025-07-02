import api from '@/config/axios';
import { User } from '@/types/api/user';
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
