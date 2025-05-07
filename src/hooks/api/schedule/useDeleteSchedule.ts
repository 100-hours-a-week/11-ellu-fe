import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "@/api/schedule";
import { AxiosError } from "axios";

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, number>({
    mutationFn: (scheduleId) => {
      return deleteSchedule(scheduleId);
    },
    retry: 1,
    onSuccess: () => {
      // 성공 시 관련된 모든 일정 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["daily-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["yearly-schedules"] });
    },
  });
};
