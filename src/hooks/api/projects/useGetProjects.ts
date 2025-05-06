import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getProjects } from '@/api/project';
import { Project } from '@/types/api/project';
import { AxiosError } from 'axios';

export const useGetProjects = () => {
  return useQuery<Project[], AxiosError>({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5분동안 캐싱
    retry: 1,
  });
};
