import { getAllSupportOffers } from "@/queries/support";
import { queryKeys, queryOptions } from "@/lib/queryConfig";
import { ISupportOffer } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSupportOffers = () => {
  return useQuery<ISupportOffer[], Error>({
    queryKey: queryKeys.supportOffers.lists(),
    queryFn: async () => {
      const data = await getAllSupportOffers();
      return data;
    },
    // Optimized caching for support offers
    ...queryOptions.supportOffers,
    // Keep previous data while refetching
    placeholderData: (previousData) => previousData,
  });
};
