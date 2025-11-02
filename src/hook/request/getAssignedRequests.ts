import { supabase } from "@/lib/supabaseClient";
import { IRequest } from "@/types/types";

export const getAssignedRequests = async (userId: string): Promise<IRequest[]> => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("assigned_to", userId);

  if (error) {
    console.error("Error fetching assigned requests:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};
