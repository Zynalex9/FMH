import { supabase } from "@/lib/supabaseClient";
import { ISupportOffer } from "@/types/types";

// Optimized query with ordering and limit
export async function getAllSupportOffers(): Promise<ISupportOffer[]> {
  const { data, error } = await supabase
    .from("support_offers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100); // Pagination limit for performance

  if (error) {
    console.error("Error fetching support offers:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
