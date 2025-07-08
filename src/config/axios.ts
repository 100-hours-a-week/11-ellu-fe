import axios from 'axios';
import { userStore } from '@/stores/userStore';
import { env } from 'next-runtime-env';

// 클라이언트에서는 env() 사용, 서버에서는 process.env 사용
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드
    return env('NEXT_PUBLIC_API_SERVER_URL');
  } else {
    // 서버 사이드
    return process.env.NEXT_PUBLIC_API_SERVER_URL;
  }
};

const baseURL = getApiUrl();

const api = axios.create({
  baseURL,
  withCredentials: true, // 쿠키 포함
});

// 요청 시 accessToken 자동 추가
api.interceptors.request.use((config) => {
  const token = userStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 403이면 자동 refresh토큰으로 갱신
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 403) {
      try {
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/token/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = refreshRes.data.data;
        userStore.getState().setAccessToken(accessToken);
        userStore.getState().setUser(user);

        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(error.config);
      } catch (err) {
        userStore.getState().clearAuth();
        // window.location.href = '/auth/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
