import { getRequest, getRequests } from "@/queries/request";
import { IRequest } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useGetRequest(id: string) {
  return useQuery<IRequest, Error>({
    queryKey: ["request", id],
    queryFn: () => getRequest(id),
    enabled: !!id, 
  });
}
