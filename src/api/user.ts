import api from '@/lib/axios';
import { User } from '@/types/api/user';

export const signup = async (nickname: string): Promise<void> => {
  await api.post('/auth/users/nickname', { nickname });
};

export const getMyInfo = async (): Promise<User> => {
  const res = await api.get('/users/me');
  return res.data.data;
};
