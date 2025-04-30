import { useMutation } from "@tanstack/react-query";
import { postKakaoLogin } from "@/api/auth";
import { KakaoLoginResponse } from "@/types/api/auth";

export const useKakaoLogin = () => {
  return useMutation<KakaoLoginResponse, Error, string>({
    mutationFn: postKakaoLogin,
  });
};
