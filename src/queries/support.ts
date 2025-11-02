import { supabase } from "@/lib/supabaseClient";
import { ISupportOffer } from "@/types/types";

export async function getAllSupportOffers(): Promise<ISupportOffer[]> {
  const { data, error } = await supabase.from("support_offers").select("*");
  if (error) {
    console.error("Error fetching support offers:", error);
    console.log("hasdhahdsa", );
    throw new Error(error.message);
  }
  console.log("datataata", data);
  return data;
}
