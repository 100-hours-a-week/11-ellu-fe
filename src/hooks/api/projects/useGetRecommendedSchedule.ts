import { useQuery } from '@tanstack/react-query';
import { getRecommendedSchedule } from '@/api/project';
import { RecommendedSchedules } from '@/types/api/project';
import { AxiosError } from 'axios';

export const useGetRecommendedSchedule = (projectId: number) => {
  return useQuery<RecommendedSchedules, AxiosError>({
    queryKey: ['recommended-schedules', projectId],
    queryFn: () => getRecommendedSchedule(projectId),
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    enabled: !!projectId,
    refetchOnMount: true,
  });
};
