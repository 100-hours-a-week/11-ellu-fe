import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '@/api/project';
import { AxiosError } from 'axios';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, number>({
    mutationFn: deleteProject,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // 삭제 후 목록 다시 fetch
      queryClient.invalidateQueries({ queryKey: ['daily-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['yearly-schedules'] });
    },
  });
};
