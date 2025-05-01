import { useMutation } from "@tanstack/react-query";
import { KakaoLogin } from "@/api/auth";
import { KakaoLoginResponse } from "@/types/api/auth";

export const useKakaoLogin = () => {
  return useMutation<KakaoLoginResponse, Error, string>({
    mutationFn: KakaoLogin,
  });
};
