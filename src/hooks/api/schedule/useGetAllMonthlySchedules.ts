import { useQuery } from '@tanstack/react-query';
import { getAllMonthlySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

type QueryOptions = {
  enabled?: boolean;
};

export const useGetAllMonthlySchedules = (month: string, options?: QueryOptions) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  return useQuery<EventData[], AxiosError>({
    queryKey: ['monthly-schedules', month],
    queryFn: () => getAllMonthlySchedules(month),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
    enabled: enabled && !!month,
  });
};
