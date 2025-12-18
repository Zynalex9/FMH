import { getRequests } from "@/queries/request";
import { queryKeys, queryOptions } from "@/lib/queryConfig";
import { IRequest } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useGetAllRequests() {
  return useQuery<IRequest[], Error>({
    queryKey: queryKeys.requests.lists(),
    queryFn: async () => {
      const data = await getRequests();
      return data ?? [];
    },
    // Optimized caching - data stays fresh for 5 minutes
    ...queryOptions.requestList,
    // Use placeholder data from cache while fetching
    placeholderData: (previousData) => previousData,
  });
}
