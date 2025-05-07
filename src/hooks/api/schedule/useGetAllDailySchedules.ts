import { useQuery } from '@tanstack/react-query';
import { getAllDailySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

// enabled 옵션을 boolean 타입으로 받도록 수정
type QueryOptions = {
  enabled?: boolean;
};

export const useGetAllDailySchedules = (date: string, options?: QueryOptions) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  return useQuery<EventData[], AxiosError>({
    queryKey: ['daily-schedules', date],
    queryFn: () => getAllDailySchedules(date),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: enabled && !!date,
  });
};
