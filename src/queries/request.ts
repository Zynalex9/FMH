import { supabase } from "@/lib/supabaseClient";
import { IRequest } from "@/types/types";

// Optimized query with specific column selection and ordering
export const getRequests = async (): Promise<IRequest[]> => {
  const { data, error } = await supabase
    .from("requests")
    .select(`
      id,
      request_title,
      status,
      priority,
      need_type,
      zone,
      contact_name,
      contact_email,
      contact_phone,
      contact_location,
      contact_information,
      contact_description,
      notes,
      proof_urls,
      source,
      submitted_by,
      assigned_to,
      created_at,
      updated_at,
      assigned_user:users!assigned_to (
        id,
        full_name,
        email,
        phone
      )
    `)
    .order("created_at", { ascending: false }) // Most recent first
    .limit(100); // Pagination limit for performance

  if (error) {
    console.error("Error fetching requests:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};

// Optimized single request query
export const getRequest = async (requestId: string): Promise<IRequest> => {
  const { data, error } = await supabase
    .from("requests")
    .select(`
      id,
      request_title,
      status,
      priority,
      need_type,
      zone,
      contact_name,
      contact_email,
      contact_phone,
      contact_location,
      contact_information,
      contact_description,
      notes,
      proof_urls,
      source,
      submitted_by,
      assigned_to,
      created_at,
      updated_at,
      assigned_user:users!assigned_to (
        id,
        full_name,
        email,
        phone
      )
    `)
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error fetching request:", error.message);
    throw new Error(error.message);
  }

  return data;
};

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