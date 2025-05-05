import api from '@/lib/axios';
import { User } from '@/types/api/user';

// 회원가입
export const signup = async (nickname: string): Promise<void> => {
  await api.post('/auth/users/nickname', { nickname });
};

// 유저 정보 조회
export const getMyInfo = async (): Promise<User> => {
  const res = await api.get('/users/me');
  return res.data.data;
};

// 유저 정보 수정
export const editMyInfo = async (nickname: string): Promise<void> => {
  await api.patch('/users/me', { nickname });
};
