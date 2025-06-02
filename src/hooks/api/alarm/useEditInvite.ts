import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { editInvite } from '@/api/alarm';
import { EditInviteParams } from '@/types/alarm';
import { useAlarmStore } from '@/stores/alarmStore';

export const useEditInvite = () => {
  const queryClient = useQueryClient();
  const { loadInitialAlarms } = useAlarmStore();

  return useMutation<void, AxiosError<{ message: string }>, EditInviteParams>({
    mutationFn: ({ notificationId, inviteStatus }) => editInvite(notificationId, inviteStatus),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
      loadInitialAlarms();
    },
  });
};
