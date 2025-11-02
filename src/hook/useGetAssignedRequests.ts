// src/hooks/request/useGetAssignedRequests.ts
import { IRequest } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getAssignedRequests } from "./request/getAssignedRequests";

export function useGetAssignedRequests(userId: string | undefined) {
  return useQuery<IRequest[], Error>({
    queryKey: ["assignedRequests", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await getAssignedRequests(userId);
      return data ?? [];
    },
    enabled: !!userId, 
  });
}
