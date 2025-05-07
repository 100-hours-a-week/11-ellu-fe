import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectSchedule } from "@/api/schedule";
import { EventData } from "@/types/calendar";
import { AxiosError } from "axios";
import { UpdateProjectScheduleParams } from "@/types/api/schedule";

export const useUpdateProjectSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    UpdateProjectScheduleParams
  >({
    mutationFn: ({ projectId, scheduleId, eventData, options = {} }) => {
      return updateProjectSchedule(projectId, scheduleId, eventData, options);
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
