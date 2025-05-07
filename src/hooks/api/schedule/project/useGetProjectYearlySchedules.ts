import { useQuery } from '@tanstack/react-query';
import { getProjectYearlySchedules } from '@/api/schedule';
import { EventData } from '@/types/calendar';
import { AxiosError } from 'axios';

// enabled 옵션을 boolean 타입으로 받도록 수정
type QueryOptions = {
  enabled?: boolean;
};

export const useGetProjectYearlySchedules = (projectId: number, year: string, options?: QueryOptions) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  return useQuery<EventData[], AxiosError<{ message: string }>>({
    queryKey: ['project-yearly-schedules', projectId, year],
    queryFn: () => getProjectYearlySchedules(projectId, year),
    staleTime: 5 * 60 * 1000,
    retry: 0,
    enabled: enabled && !!projectId && !!year,
  });
};
