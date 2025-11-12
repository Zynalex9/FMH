import { supabase } from "@/lib/supabaseClient";
import { IRequest } from "@/types/types";

export const getRequests = async (): Promise<IRequest[]> => {
  const { data, error } = await supabase.from("requests").select(`
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
}
export async function updateRequestFn(
  status: string,
  notes: string,
  requestId: string,
  proofUrls?: string[]          
): Promise<IRequest> {
  const updatePayload: Partial<IRequest> = { status, notes };

  // Only add proof_urls if we actually received new URLs
  if (proofUrls && proofUrls.length > 0) {
    updatePayload.proof_urls = proofUrls;
  }

  const { data, error } = await supabase
    .from("requests")
    .update(updatePayload)
    .eq("id", requestId)
    .select("*")
    .single();

  if (error) throw error;

  return data;
}