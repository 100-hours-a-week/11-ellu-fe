import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjectMeetingNote } from '@/api/project';
import { AxiosError } from 'axios';

export const useCreateMeetingNote = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, { projectId: number; meetingNote: string }>({
    mutationFn: ({ projectId, meetingNote }) => createProjectMeetingNote(projectId, meetingNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommended-schedules'] }); // 생성 후 목록 다시 fetch
    },
  });
};
