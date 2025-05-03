import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '@/api/project';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // 삭제 후 목록 다시 fetch
    },
  });
};
