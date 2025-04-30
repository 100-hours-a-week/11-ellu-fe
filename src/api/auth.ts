import api from "@/lib/axios";
import { KakaoLoginResponse } from "@/types/api/auth";

export const postKakaoLogin = async (
  code: string
): Promise<KakaoLoginResponse> => {
  const res = await api.post("/auth/token", { code });
  return res.data;
};

export const logout = () => api.post("/auth/logout"); // 그대로 두면 됨
