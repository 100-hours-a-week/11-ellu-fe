import { useQuery } from '@tanstack/react-query';
import { getUserProgress } from '@/api/user';
import { UserProgress } from '@/types/api/user';

export const useGetUserProgress = () => {
  return useQuery<UserProgress>({
    queryKey: ['user-progress'],
    queryFn: () => getUserProgress(),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
