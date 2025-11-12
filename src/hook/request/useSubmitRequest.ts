import { IRequest } from "@/types/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

export function useSubmitRequest() {
  return useMutation({
    mutationFn: async (data: IRequest) => {
      const { error } = await SupabaseClient.from("requests").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      console.log("✅ Request submitted successfully!");
    },
    onError: (err) => {
      console.error("❌ Error submitting:", err);
    },
  });
}
