// src/hooks/request/useGetAssignedRequests.ts
import { IRequest } from "@/types/types";
import { queryKeys, queryOptions } from "@/lib/queryConfig";
import { useQuery } from "@tanstack/react-query";
import { getAssignedRequests } from "./request/getAssignedRequests";

export function useGetAssignedRequests(userId: string | undefined) {
  return useQuery<IRequest[], Error>({
    queryKey: queryKeys.requests.assigned(userId ?? ""),
    queryFn: async () => {
      if (!userId) return [];
      const data = await getAssignedRequests(userId);
      return data ?? [];
    },
    enabled: !!userId,
    // Optimized caching - assigned requests don't change frequently
    ...queryOptions.requestList,
    // Keep previous data while refetching
    placeholderData: (previousData) => previousData,
  });
}
