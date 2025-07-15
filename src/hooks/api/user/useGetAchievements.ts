import { useQuery } from '@tanstack/react-query';
import { getUserAchievements } from '@/api/user';

export const useGetAchievements = () => {
  return useQuery({
    queryKey: ['userAchievements'],
    queryFn: getUserAchievements,
    staleTime: 1000 * 60 * 5,
  });
};
