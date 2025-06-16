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
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      loadInitialAlarms();
    },
    onError: (error) => {
      alert('알람을 처리하는데 실패했습니다.');
    },
  });
};
