import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSchedule } from '@/api/schedule';
import { AxiosError } from 'axios';
import { CreateScheduleParams } from '@/types/api/schedule';

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, CreateScheduleParams>({
    mutationFn: ({ eventData, options = {} }) => {
      return createSchedule(eventData, options);
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
