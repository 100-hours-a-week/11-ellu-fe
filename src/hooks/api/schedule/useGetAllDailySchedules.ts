import { useQuery } from '@tanstack/react-query';
import { getAllDailySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

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
    refetchOnWindowFocus: true,
    enabled: enabled && !!date,
  });
};
