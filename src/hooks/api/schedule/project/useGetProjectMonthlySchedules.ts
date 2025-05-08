import { useQuery } from '@tanstack/react-query';
import { getProjectMonthlySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

type QueryOptions = {
  enabled?: boolean;
};

export const useGetProjectMonthlySchedules = (projectId: number, month: string, options?: QueryOptions) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  return useQuery<EventData[], AxiosError<{ message: string }>>({
    queryKey: ['project-monthly-schedules', projectId, month],
    queryFn: () => getProjectMonthlySchedules(projectId, month),
    staleTime: 5 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: true,
    enabled: enabled && !!projectId && !!month,
  });
};
