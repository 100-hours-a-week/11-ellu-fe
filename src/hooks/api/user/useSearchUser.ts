import { useQuery } from '@tanstack/react-query';
import { searchUsersByNickname } from '@/api/user';
import { User } from '@/types/api/user';

export const useSearchUser = (query: string) => {
  return useQuery<User[]>({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsersByNickname(query),
    enabled: query.length > 0,
  });
};
