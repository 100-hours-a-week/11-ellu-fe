import { useMutation } from '@tanstack/react-query';
import { createProjectMeetingNote } from '@/api/project';
import { AxiosError } from 'axios';
import { RecommendedSchedules } from '@/types/api/project';

export const useCreateMeetingNote = () => {
  return useMutation<RecommendedSchedules, AxiosError, { projectId: number; meetingNote: string }>({
    mutationFn: ({ projectId, meetingNote }) => createProjectMeetingNote(projectId, meetingNote),
  });
};
