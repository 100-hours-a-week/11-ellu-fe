import { useQuery } from '@tanstack/react-query';
import { getProjectDailySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

type QueryOptions = {
  enabled?: boolean;
};

export const useGetProjectDailySchedules = (projectId: number, date: string, options?: QueryOptions) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  return useQuery<EventData[], AxiosError<{ message: string }>>({
    queryKey: ['project-daily-schedules', projectId, date],
    queryFn: () => getProjectDailySchedules(projectId, date),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: enabled && !!projectId && !!date,
  });
};
