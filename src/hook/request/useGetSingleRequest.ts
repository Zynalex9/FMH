import { getRequest } from "@/queries/request";
import { queryKeys, queryOptions } from "@/lib/queryConfig";
import { IRequest } from "@/types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetRequest(id: string) {
  const queryClient = useQueryClient();

  return useQuery<IRequest, Error>({
    queryKey: queryKeys.requests.detail(id),
    queryFn: () => getRequest(id),
    enabled: !!id,
    // Optimized caching for detail views
    ...queryOptions.requestDetail,
    // Try to get initial data from the requests list cache
    initialData: () => {
      const cachedRequests = queryClient.getQueryData<IRequest[]>(
        queryKeys.requests.lists()
      );
      return cachedRequests?.find((request) => request.id === id);
    },
    // Only use initialData if it's recent (within 2 minutes)
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(queryKeys.requests.lists())?.dataUpdatedAt;
    },
  });
}
