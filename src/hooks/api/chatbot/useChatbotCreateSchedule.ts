import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatbotCreateSchedule } from '@/api/chatbot';
import { AxiosError } from 'axios';
import { ChatbotCreateScheduleParams } from '@/types/api/schedule';

export const useChatbotCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, ChatbotCreateScheduleParams>({
    mutationFn: ({ planTitle, eventDataList }) => {
      return chatbotCreateSchedule(planTitle, eventDataList);
    },
    retry: 1,
    onSuccess: () => {
      // 성공 시 관련된 모든 일정 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['daily-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['yearly-schedules'] });
    },
  });
};
