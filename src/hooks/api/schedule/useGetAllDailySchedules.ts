import { useQuery } from "@tanstack/react-query";
import { getAllDailySchedules } from "@/api/schedule";
import { EventData } from "@/types/calendar";
import { AxiosError } from "axios";

export const useGetAllDailySchedules = (date: string) => {
  return useQuery<EventData[], AxiosError>({
    queryKey: ["daily-schedules", date],
    queryFn: () => getAllDailySchedules(date),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!date,
  });
};
