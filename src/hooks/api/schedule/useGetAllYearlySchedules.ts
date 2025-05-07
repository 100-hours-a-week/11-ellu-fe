import { useQuery } from "@tanstack/react-query";
import { getAllYearlySchedules } from "@/api/schedule";
import { EventData } from "@/types/calendar";
import { AxiosError } from "axios";

export const useGetAllYearlySchedules = (year: string) => {
  return useQuery<EventData[], AxiosError>({
    queryKey: ["yearly-schedules", year],
    queryFn: () => getAllYearlySchedules(year),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!year,
  });
};
