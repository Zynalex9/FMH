"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="py-10 px-4 md:px-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 pb-6">
        {filters.map(({ label, options, value, setValue }) => (
          <DropdownMenu key={label}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-0 bg-sgreen rounded-full text-black text-sm md:text-base"
              >
                {label}
                <span className="ml-1">&#9662;</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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

      {/* Table / Cards */}
      <div className="border rounded-lg bg-cbg overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3 min-w-[600px]">
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
          <div className="p-6 text-red-600 min-w-[600px]">
            Error loading support offers: {error.message}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
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
                      <TableCell className="text-cgreen py-4 break-words">
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
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-2 space-y-4">
              {filteredOffers.map((offer: ISupportOffer) => (
                <div
                  key={offer.id}
                  className="bg-sgreen/30 rounded-lg p-4 shadow-sm border border-gray-200 hover:bg-sgreen/40 transition-colors cursor-pointer"
                >
                  <h2 className="font-semibold text-black mb-2 capitalize">
                    {capitalizeWords(offer.full_name)}
                  </h2>
                  <p className="text-sm text-gray-700 break-words">
                    <strong>Contact:</strong> {offer.contact_information}
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    <strong>Donation:</strong>{" "}
                    {FIXED_DONATION_TYPES.includes(
                      capitalizeWords(offer.donation_type)
                    )
                      ? capitalizeWords(offer.donation_type)
                      : "Other"}
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    <strong>Availability:</strong> {capitalizeWords(offer.availability)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>For Events:</strong> {offer.for_events ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>For Outreach:</strong> {offer.for_outreachs ? "Yes" : "No"}
                  </p>
                </div>
              ))}

              {filteredOffers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No support offers found matching your filters.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
