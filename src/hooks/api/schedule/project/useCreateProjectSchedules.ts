import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectSchedules } from "@/api/schedule";
import { AxiosError } from "axios";
import { CreateProjectSchedulesParams } from "@/types/api/schedule";

export const useCreateProjectSchedules = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    CreateProjectSchedulesParams
  >({
    mutationFn: ({ projectId, eventDataList, options = {} }) => {
      return createProjectSchedules(projectId, eventDataList, options);
    },
    retry: 1,
    onSuccess: (_, variables) => {
      // 성공 시 관련된 프로젝트 일정 쿼리 무효화
      const { projectId } = variables;

      queryClient.invalidateQueries({
        queryKey: ["project-daily-schedules", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-monthly-schedules", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-yearly-schedules", projectId],
      });

      queryClient.invalidateQueries({ queryKey: ["daily-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["yearly-schedules"] });
    },
  });
};
