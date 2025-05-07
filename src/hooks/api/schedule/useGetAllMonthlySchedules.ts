import { useQuery } from "@tanstack/react-query";
import { getAllMonthlySchedules } from "@/api/schedule";
import { EventData } from "@/types/calendar";
import { AxiosError } from "axios";

export const useGetAllMonthlySchedules = (month: string) => {
  return useQuery<EventData[], AxiosError>({
    queryKey: ["monthly-schedules", month],
    queryFn: () => getAllMonthlySchedules(month),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!month,
  });
};
