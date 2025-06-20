import { useQuery } from '@tanstack/react-query';
import { getChatMessage } from '@/api/chatbot';
import { ChatMessage } from '@/types/api/chatbot';
import { AxiosError } from 'axios';

export const useGetChatMessage = () => {
  return useQuery<ChatMessage[], AxiosError>({
    queryKey: ['chat-messages'],
    queryFn: getChatMessage,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
};
