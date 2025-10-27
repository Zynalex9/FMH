import { getRequests } from "@/queries/request";
import { IRequest } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useGetAllRequests() {
  return useQuery<IRequest[], Error>({
    queryKey: ["allRequests"],
    queryFn: async () => {
      const data = await getRequests();
      return data ?? [];
    },
  });
}
