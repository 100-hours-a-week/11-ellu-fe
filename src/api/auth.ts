import api from "@/lib/axios";
import { KakaoLoginResponse } from "@/types/api/auth";

// 로그인
export const KakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const res = await api.post("/auth/token", { code });
  return res.data.data;
};

//로그아웃
export const logout = () => api.delete("/auth/token");
