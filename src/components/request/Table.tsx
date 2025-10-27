"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
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
import { useGetAllRequests } from "@/hook/request/useGetAllRequests";
import { IRequest } from "@/types/types";

// 🎨 Helper for status color badges
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "requested":
      return "bg-sgreen text-black";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 🧱 Filters
const NEED_TYPES = [
  "Food Assistance",
  "Clothing",
  "Shelter",
  "Medical Supplies",
];
const STATUSES = ["Requested", "Picked Up", "En Route", "Delivered"];
const ZONES = ["Zone A", "Zone B", "Zone C"];
const SOURCES = ["Referral", "Walk-in", "Online"];

export default function RequestsPage() {
  const { locale } = useParams();
  const router = useRouter();

  const [selectedNeedType, setSelectedNeedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const { data: requests, isLoading, error } = useGetAllRequests();

  const filteredData = useMemo(() => {
    if (!requests) return [];

    return requests.filter((item) => {
      const needTypeMatch =
        !selectedNeedType ||
        item.need_type?.toLowerCase().includes(selectedNeedType.toLowerCase());

      const statusMatch =
        !selectedStatus ||
        item.status?.toLowerCase().includes(selectedStatus.toLowerCase());

      const zoneMatch =
        !selectedZone ||
        item.zone?.toLowerCase().includes(selectedZone.toLowerCase());

      const sourceMatch =
        !selectedSource ||
        item.source?.toLowerCase().includes(selectedSource.toLowerCase());

      return needTypeMatch && statusMatch && zoneMatch && sourceMatch;
    });
  }, [
    requests,
    selectedNeedType,
    selectedStatus,
    selectedZone,
    selectedSource,
  ]);
  const handleRowClick = (id: string) => {
    router.push(`/${locale}/requests/${id}`);
  };

  return (
    <main className="min-h-screen bg-cbg p-6">
      <div className="w-full md:max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Requests</h1>
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            {
              label: "Need Type",
              options: NEED_TYPES,
              value: selectedNeedType,
              setValue: setSelectedNeedType,
            },
            {
              label: "Status",
              options: STATUSES,
              value: selectedStatus,
              setValue: setSelectedStatus,
            },
            {
              label: "Zone",
              options: ZONES,
              value: selectedZone,
              setValue: setSelectedZone,
            },
            {
              label: "Source",
              options: SOURCES,
              value: selectedSource,
              setValue: setSelectedSource,
            },
          ].map(({ label, options, value, setValue }) => (
            <DropdownMenu key={label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-0 bg-sgreen rounded-full text-black"
                >
                  {label}
                  <ChevronDown className="w-4 h-4" />
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
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-red-600">
              Error fetching requests: {error.message}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-cbg border-0">
                  <TableRow className="border-0">
                    <TableHead className="text-black">Request #</TableHead>
                    <TableHead className="text-cgreen">Need Type</TableHead>
                    <TableHead className="text-cgreen">Zone</TableHead>
                    <TableHead className="text-cgreen">Source</TableHead>
                    <TableHead className="text-cgreen">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((request) => (
                    <TableRow
                      key={request.id}
                      onClick={() => handleRowClick(request.id)}
                      className="cursor-pointer hover:bg-sgreen/40 transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      <TableCell className="py-4 text-black font-medium capitalize">
                        {request.request_number}
                      </TableCell>
                      <TableCell className="text-cgreen py-4 capitalize">
                        {request.need_type}
                      </TableCell>
                      <TableCell className="text-cgreen py-4 capitalize">
                        {request.zone}
                      </TableCell>
                      <TableCell className="text-cgreen py-4 capitalize">
                        {request.source}
                      </TableCell>
                      <TableCell className="py-4 capitalize">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No requests found matching your filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
