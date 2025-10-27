import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
type CreateSupportOffer = {
  full_name: string;
  donation_type: string;
  contact_information: string;
  availability: string;
  for_events: boolean;
  for_outreachs: boolean;
};
export const useCreateSupportOffer = () => {
  return useMutation({
    mutationFn: async (data: CreateSupportOffer) => {
      const { error } = await supabase.from("support_offers").insert([data]);
      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success("Support offer created successfully!");
      return true;
    },
  });
};
