import { supabase } from "@/lib/supabaseClient";
import { IRequest } from "@/types/types";

// Optimized query with specific columns, ordering, and limit
export const getAssignedRequests = async (userId: string): Promise<IRequest[]> => {
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
      updated_at
    `)
    .eq("assigned_to", userId)
    .order("created_at", { ascending: false })
    .limit(50); // Reasonable limit for assigned requests

  if (error) {
    console.error("Error fetching assigned requests:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};
