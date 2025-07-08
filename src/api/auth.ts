import api from '@/config/axios';
import { KakaoLoginResponse } from '@/types/api/auth';
import { User } from '@/types/api/user';
import { ApiResponse } from '@/types/api/common';

// 로그인
export const KakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const res = await api.post<ApiResponse<KakaoLoginResponse>>('/auth/token', { code });
  return res.data.data;
};

//로그아웃
export const logout = () => api.delete<ApiResponse<void>>('/auth/token');

// accessToken 재발급 (클라이언트)
export const refreshAccessToken = async (): Promise<{ accessToken: string; user: User } | null> => {
  const res = await api.post<ApiResponse<{ accessToken: string; user: User }>>('/auth/token/refresh');
  return res.data.data;
};

// accessToken 재발급 (서버)
export const getAccessToken = async (refreshToken: string): Promise<string | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/token/refresh`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data.data.accessToken;
};
