import { useMutation } from '@tanstack/react-query';
import { editMyInfo } from '@/api/user';
import { AxiosError } from 'axios';

export const useEditMyInfo = () => {
  return useMutation<void, AxiosError<{ message: string }>, string>({
    mutationFn: editMyInfo,
    retry: false,
  });
};
