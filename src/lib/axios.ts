import axios from "axios";
import { userStore } from "@/stores/userStore";

const baseURL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}`;

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

// // 응답에서 401이면 자동 refresh → 재시도
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         const refreshRes = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         const { accessToken, user } = refreshRes.data;
//         userStore.getState().setAccessToken(accessToken);
//         userStore.getState().setUser(user);

//         error.config.headers.Authorization = `Bearer ${accessToken}`;
//         return api.request(error.config);
//       } catch (err) {
//         userStore.getState().clearAuth();
//         window.location.href = "/auth/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
