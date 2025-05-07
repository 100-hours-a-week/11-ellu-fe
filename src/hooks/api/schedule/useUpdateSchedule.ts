import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSchedule } from "@/api/schedule";
import { AxiosError } from "axios";
import { UpdateScheduleParams } from "@/types/api/schedule";

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    UpdateScheduleParams
  >({
    mutationFn: ({ scheduleId, eventData, options = {} }) => {
      return updateSchedule(scheduleId, eventData, options);
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
