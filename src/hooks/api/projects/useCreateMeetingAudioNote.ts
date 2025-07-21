import { useMutation } from '@tanstack/react-query';
import { createProjectMeetingAudioNote } from '@/api/project';
import { AxiosError } from 'axios';
import { RecommendedSchedules } from '@/types/api/project';

export const useCreateMeetingAudioNote = () => {
  return useMutation<RecommendedSchedules, AxiosError, { projectId: number; audioNote: File }>({
    mutationFn: ({ projectId, audioNote }) => createProjectMeetingAudioNote(projectId, audioNote),
  });
};
