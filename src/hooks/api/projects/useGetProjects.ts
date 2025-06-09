import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getProjects } from '@/api/project';
import { Project } from '@/types/api/project';
import { AxiosError } from 'axios';

export const useGetProjects = () => {
  return useQuery<Project[], AxiosError>({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 1 * 60 * 1000, // 1분동안 캐싱
    retry: 1,
  });
};
