import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { queryKeys } from "@/lib/queryConfig";

interface RequestData {
  request_title?: string;
  contact_description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  priority?: string;
  need_type: string;
  zone: string;
  notes?:string
  contact_location?: string;
  source: string;
  submitted_by?: string | null;
  contact_information: string;
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: RequestData) => {
      const { data, error } = await supabase
        .from("requests")
        .insert(requestData)
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate request lists to include the new request
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.lists(),
      });
    },
  });
}
