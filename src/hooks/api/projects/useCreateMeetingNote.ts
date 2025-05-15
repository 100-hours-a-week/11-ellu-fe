import { useMutation } from '@tanstack/react-query';
import { createProjectMeetingNote } from '@/api/project';
import { AxiosError } from 'axios';

export const useCreateMeetingNote = () => {
  return useMutation<void, AxiosError, { projectId: number; meetingNote: string }>({
    mutationFn: ({ projectId, meetingNote }) => createProjectMeetingNote(projectId, meetingNote),
  });
};
