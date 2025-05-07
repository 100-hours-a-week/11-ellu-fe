import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/project";

export const useGetProjectById = (projectId: number) => {
  return useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: () => getProjectById(projectId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!projectId, // projectId가 있을 때만 쿼리 실행
  });
};
