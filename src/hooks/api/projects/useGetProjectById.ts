import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/api/project';
import { Project } from '@/types/api/project';
import { AxiosError } from 'axios';

export const useGetProjectById = (projectId: number) => {
  return useQuery({
    queryKey: ['project-detail'],
    queryFn: () => getProjectById(projectId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!projectId, // projectId가 있을 때만 쿼리 실행
  });
};
