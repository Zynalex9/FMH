"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalizeWords } from "@/lib/helper";
import { useGetAllSupportOffers } from "@/hook/support/useGetAllSupportOffers";
import { ISupportOffer } from "@/types/types";
import { filterSupportOffers, getDonationTypes } from "@/lib/helper";

const FIXED_DONATION_TYPES = [
  "Money",
  "Food",
  "Clothes",
  "Medicine",
  "Hygiene Kit",
];

export function SupportOffersTable() {
  const { data: supportOffers, isLoading, error } = useGetAllSupportOffers();

  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string | null>(null);
  const [selectedOutreach, setSelectedOutreach] = useState<string | null>(null);

  const donationTypes = useMemo(
    () => (supportOffers ? getDonationTypes(supportOffers) : []),
    [supportOffers]
  );

  const filteredOffers = useMemo(
    () =>
      supportOffers
        ? filterSupportOffers(
            supportOffers,
            selectedDonation,
            selectedEvents,
            selectedOutreach
          )
        : [],
    [supportOffers, selectedDonation, selectedEvents, selectedOutreach]
  );

  const BOOLEAN_OPTIONS = ["Yes", "No"];

  const filters = [
    {
      label: "Donation Type",
      options: donationTypes,
      value: selectedDonation,
      setValue: setSelectedDonation,
    },
    {
      label: "For Events",
      options: BOOLEAN_OPTIONS,
      value: selectedEvents,
      setValue: setSelectedEvents,
    },
    {
      label: "For Outreach",
      options: BOOLEAN_OPTIONS,
      value: selectedOutreach,
      setValue: setSelectedOutreach,
    },
  ];

  return (
    <div className="py-10">
      {/* Filters */}
      <div className="flex gap-4 pb-6 flex-wrap">
        {filters.map(({ label, options, value, setValue }) => (
          <DropdownMenu key={label}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-0 bg-sgreen rounded-full text-black"
              >
                {label}
                <span className="ml-1">&#9662;</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setValue(null)}>
                All
              </DropdownMenuItem>
              {options.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setValue(opt)}
                  className={value === opt ? "bg-accent" : ""}
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-cbg">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-4">
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">
            Error loading support offers: {error.message}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-cbg border-0">
                <TableRow className="border-0">
                  <TableHead className="text-black">Name</TableHead>
                  <TableHead className="text-cgreen">Contact Info</TableHead>
                  <TableHead className="text-cgreen">Donation Type</TableHead>
                  <TableHead className="text-cgreen">Availability</TableHead>
                  <TableHead className="text-cgreen">For Events</TableHead>
                  <TableHead className="text-cgreen">For Outreach</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer: ISupportOffer) => (
                  <TableRow
                    key={offer.id}
                    className="cursor-pointer hover:bg-sgreen/40 transition-colors border-b border-gray-200 last:border-b-0"
                  >
                    <TableCell className="py-4 text-black font-medium capitalize">
                      {capitalizeWords(offer.full_name)}
                    </TableCell>
                    <TableCell className="text-cgreen py-4">
                      {offer.contact_information}
                    </TableCell>
                    <TableCell className="text-cgreen py-4 capitalize">
                      {FIXED_DONATION_TYPES.includes(
                        capitalizeWords(offer.donation_type)
                      )
                        ? capitalizeWords(offer.donation_type)
                        : "Other"}
                    </TableCell>
                    <TableCell className="text-cgreen py-4 capitalize">
                      {capitalizeWords(offer.availability)}
                    </TableCell>
                    <TableCell className="py-4 capitalize">
                      {offer.for_events ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="py-4 capitalize">
                      {offer.for_outreachs ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOffers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No support offers found matching your filters.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
