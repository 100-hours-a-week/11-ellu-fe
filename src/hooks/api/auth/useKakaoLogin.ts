import { useMutation } from '@tanstack/react-query';
import { KakaoLogin } from '@/api/auth';
import { KakaoLoginResponse } from '@/types/api/auth';
import { AxiosError } from 'axios';

export const useKakaoLogin = () => {
  return useMutation<KakaoLoginResponse, AxiosError<{ message: string }>, string>({
    mutationFn: KakaoLogin,
  });
};
