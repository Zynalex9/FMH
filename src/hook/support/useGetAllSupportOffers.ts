import { getAllSupportOffers } from "@/queries/support";
import { ISupportOffer } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllSupportOffers = () => {
  return useQuery<ISupportOffer[], Error>({
    queryKey: ["allSupportOffers"],
    queryFn: async () => {
      const data = await getAllSupportOffers();
      return data;
    },
  });
};
