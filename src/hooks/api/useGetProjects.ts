import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/api/project';

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
};
