import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

export function useVolunteerSubmit() {
  return useMutation({
    mutationFn: async (data: any) => {
      const { error } = await SupabaseClient.from("volunteers").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      console.log("✅ Volunteer registered successfully!");
    },
    onError: (err) => {
      console.error("❌ Volunteer form error:", err);
    },
  });
}
