import { supabase } from "@/lib/supabaseClient";
import { queryKeys } from "@/lib/queryConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateSupportOffer = {
  full_name: string;
  contact_information: string;
  password?: string | null;
  donation_type: string;
  donationTypeOther?: string;
  availability: string;
  created_by?: string | null;
};

export const useCreateSupportOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSupportOffer) => {
      const { error } = await supabase.from("support_offers").insert([data]);
      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success("Thank you for requesting to help FMH strengthen and connect communities! We'll be contacting you soon");
      return true;
    },
    onSuccess: () => {
      // Invalidate support offers list to include the new offer
      queryClient.invalidateQueries({
        queryKey: queryKeys.supportOffers.lists(),
      });
    },
  });
};
