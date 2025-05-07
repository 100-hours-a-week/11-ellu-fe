import { useQuery } from '@tanstack/react-query';
import { getAllYearlySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

type QueryOptions = {
  enabled?: boolean;
};

export const useGetAllYearlySchedules = (year: string, options?: QueryOptions) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  return useQuery<EventData[], AxiosError>({
    queryKey: ['yearly-schedules', year],
    queryFn: () => getAllYearlySchedules(year),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: enabled && !!year,
  });
};
