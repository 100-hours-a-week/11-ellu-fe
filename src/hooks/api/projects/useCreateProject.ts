import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/api/project';
import { AxiosError } from 'axios';
import { ProjectFormData } from '@/types/api/project';

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, ProjectFormData>({
    mutationFn: createProject,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // 생성 후 목록 다시 fetch
    },
  });
};
