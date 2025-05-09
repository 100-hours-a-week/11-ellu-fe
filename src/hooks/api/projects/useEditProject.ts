import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editProject } from '@/api/project';
import { AxiosError } from 'axios';
import { EditProjectParams } from '@/types/api/project';

export const useEditProject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, EditProjectParams>({
    mutationFn: ({ projectId, data }) => editProject(projectId, data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-detail'] });
    },
  });
};
