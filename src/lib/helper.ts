export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
import { ISupportOffer } from "@/types/types";

export const FIXED_DONATION_TYPES = [
  "Money",
  "Food",
  "Clothes",
  "Medicine",
  "Hygiene Kit",
];

/**
 * Extract donation types for filters, grouping unknown types as 'Other'
 */
export function getDonationTypes(supportOffers: ISupportOffer[]) {
  const typesSet = new Set<string>();
  supportOffers.forEach((offer) => {
    const type = capitalizeWords(offer.donation_type);
    if (FIXED_DONATION_TYPES.includes(type)) {
      typesSet.add(type);
    } else {
      typesSet.add("Other");
    }
  });

  const result: string[] = [];
  FIXED_DONATION_TYPES.forEach((type) => {
    if (typesSet.has(type)) result.push(type);
  });
  if (typesSet.has("Other")) result.push("Other");

  return result;
}

/**
 * Filter support offers based on selected filters
 */
export function filterSupportOffers(
  supportOffers: ISupportOffer[],
  selectedDonation: string | null,
  selectedEvents: string | null,
  selectedOutreach: string | null
) {
  return supportOffers.filter((offer) => {
    const type = capitalizeWords(offer.donation_type);
    const donationTypeMatch =
      !selectedDonation ||
      (FIXED_DONATION_TYPES.includes(type)
        ? type === selectedDonation
        : selectedDonation === "Other");

    const eventsMatch =
      !selectedEvents || (offer.for_events ? "Yes" : "No") === selectedEvents;

    const outreachMatch =
      !selectedOutreach || (offer.for_outreachs ? "Yes" : "No") === selectedOutreach;

    return donationTypeMatch && eventsMatch && outreachMatch;
  });
}