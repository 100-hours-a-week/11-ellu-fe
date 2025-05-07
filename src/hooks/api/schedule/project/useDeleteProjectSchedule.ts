import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectSchedule } from "@/api/schedule";
import { AxiosError } from "axios";
import { DeleteProjectScheduleParams } from "@/types/api/schedule";

export const useDeleteProjectSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    DeleteProjectScheduleParams
  >({
    mutationFn: ({ projectId, scheduleId }) => {
      return deleteProjectSchedule(projectId, scheduleId);
    },
    onSuccess: (_, variables) => {
      const { projectId } = variables;

      // 프로젝트 관련 일정 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["project-daily-schedules", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-monthly-schedules", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-yearly-schedules", projectId],
      });

      // 전체 일정 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["daily-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["yearly-schedules"] });
    },
  });
};
