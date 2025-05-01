import api from '@/lib/axios';
import { KakaoLoginResponse } from '@/types/api/auth';

// 로그인
export const KakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const res = await api.post('/auth/token', { code });
  return res.data.data;
};

//로그아웃
export const logout = () => api.delete('/auth/token');

// accessToken 재발급 (서버 컴포넌트)
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
