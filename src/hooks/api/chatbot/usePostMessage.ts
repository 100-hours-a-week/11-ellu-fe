import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MessageData } from '@/types/chatbot';
import { postMessage } from '@/api/chatbot';

export const usePostMessage = () => {
  return useMutation<void, AxiosError<{ message: string }>, MessageData>({
    mutationFn: postMessage,
    retry: 1,
  });
};
