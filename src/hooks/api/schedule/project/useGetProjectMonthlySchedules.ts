import { useQuery } from "@tanstack/react-query";
import { getProjectMonthlySchedules } from "@/api/schedule";
import { EventData } from "@/types/calendar";
import { AxiosError } from "axios";

export const useGetProjectMonthlySchedules = (
  projectId: number,
  month: string
) => {
  return useQuery<EventData[], AxiosError<{ message: string }>>({
    queryKey: ["project-monthly-schedules", projectId, month],
    queryFn: () => getProjectMonthlySchedules(projectId, month),
    staleTime: 5 * 60 * 1000,
    retry: 0,
    enabled: !!projectId && !!month,
  });
};
