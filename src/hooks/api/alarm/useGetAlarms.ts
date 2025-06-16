import { useQuery } from '@tanstack/react-query';
import { getAlarms } from '@/api/alarm';
import { Alarm } from '@/types/alarm';
import { AxiosError } from 'axios';

export const useGetAlarms = () => {
  return useQuery<Alarm[], AxiosError>({
    queryKey: ['alarms'],
    queryFn: getAlarms,
    staleTime: 0,
    retry: 1,
  });
};
