import { useQuery } from "@tanstack/react-query";
import { getProjectYearlySchedules } from "@/api/schedule";
import { EventData } from "@/types/calendar";
import { AxiosError } from "axios";

export const useGetProjectYearlySchedules = (
  projectId: number,
  year: string
) => {
  return useQuery<EventData[], AxiosError<{ message: string }>>({
    queryKey: ["project-yearly-schedules", projectId, year],
    queryFn: () => getProjectYearlySchedules(projectId, year),
    staleTime: 5 * 60 * 1000,
    retry: 0,
    enabled: !!projectId && !!year,
  });
};
