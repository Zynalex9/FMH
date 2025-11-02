import { supabase } from "@/lib/supabaseClient";
import { IRequest } from "@/types/types";

export const getRequests = async (): Promise<IRequest[]> => {
  const { data, error } = await supabase
    .from("requests")
    .select(`
      *,
      assigned_user:users!assigned_to (
        id,
        full_name,
        email,
        phone
      )
    `);

  if (error) {
    console.error("Error fetching requests:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getRequest = async (requestId: string): Promise<IRequest> => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error fetching requests:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};
