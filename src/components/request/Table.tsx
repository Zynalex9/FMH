"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import AssignVolunteerDialog from "./AssignVolunteerDialog";
import { capitalizeWords } from "@/lib/helper";

// 🎨 Helper for status color badges
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "requested":
      return "bg-sgreen text-black";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function RequestsPage() {
  const { locale } = useParams();
  const router = useRouter();
  const t = useTranslations("all_requests");
  const NEED_TYPES = [
    t("needTypes.food"),
    t("needTypes.clothing"),
    t("needTypes.shelter"),
    t("needTypes.medical"),
  ];
  const STATUSES = [
    t("statuses.requested"),
    t("statuses.pickedUp"),
    t("statuses.enRoute"),
    t("statuses.delivered"),
  ];
  const ZONES = [t("zones.a"), t("zones.b"), t("zones.c")];
  const SOURCES = [
    t("sources.referral"),
    t("sources.walkIn"),
    t("sources.online"),
  ];

  const [selectedNeedType, setSelectedNeedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const { data: requests, isLoading, error } = useGetAllRequests();
  console.log("data",requests);
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
console.log("filteredData",filteredData);
  const handleRowClick = (id: string) => {
    router.push(`/${locale}/requests/${id}`);
  };

return (
  <main className="min-h-screen bg-cbg p-4 sm:p-6">
    <div className="w-full md:max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-black">
        {t("title")}
      </h1>

      {/* 🧭 Filters */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: t("filters.needType"),
            options: NEED_TYPES,
            value: selectedNeedType,
            setValue: setSelectedNeedType,
          },
          {
            label: t("filters.status"),
            options: STATUSES,
            value: selectedStatus,
            setValue: setSelectedStatus,
          },
          {
            label: t("filters.zone"),
            options: ZONES,
            value: selectedZone,
            setValue: setSelectedZone,
          },
          {
            label: t("filters.source"),
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
                {t("filters.all")}
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

      {/* 🧱 Table / Cards */}
      <div className="border rounded-lg bg-cbg overflow-hidden">
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
            {t("errors.fetch")}: {error.message}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-cbg border-0">
                  <TableRow className="border-0">
                    <TableHead className="text-black">
                      Request
                    </TableHead>
                    <TableHead className="text-cgreen">
                      {t("table.needType")}
                    </TableHead>
                    <TableHead className="text-cgreen">
                      {t("table.zone")}
                    </TableHead>
                    <TableHead className="text-cgreen">
                      {t("table.source")}
                    </TableHead>
                    <TableHead className="text-cgreen">
                      {t("table.status")}
                    </TableHead>
                    <TableHead className="text-cgreen">
                      {t("table.assigned")}
                    </TableHead>
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
                        {request.request_title? request.request_title : `No Title`} 
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
                      <TableCell>
                        {request.assigned_user ? (
                          <span
                            className="text-cgreen font-medium"
                            title={
                              request.assigned_user.full_name ||
                              request.assigned_user.email ||
                              request.assigned_user.phone ||
                              t("unknown")
                            }
                          >
                            {capitalizeWords(
                              request.assigned_user.full_name ||
                                request.assigned_user.email ||
                                request.assigned_user.phone ||
                                t("unknown")
                            ).slice(0, 5) + "..."}
                          </span>
                        ) : (
                          <AssignVolunteerDialog requestId={request.id} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-2 space-y-4">
              {filteredData.map((request) => (
                <div
                  key={request.id}
                  onClick={() => handleRowClick(request.id)}
                  className="bg-sgreen/30 rounded-lg p-4 shadow-sm border border-gray-200 hover:bg-sgreen/40 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-black">
                      #{request.request_number}
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 capitalize">
                    <strong>{t("table.needType")}:</strong> {request.need_type}
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    <strong>{t("table.zone")}:</strong> {request.zone}
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    <strong>{t("table.source")}:</strong> {request.source}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>{t("table.assigned")}:</strong>{" "}
                    {request.assigned_user ? (
                      capitalizeWords(
                        request.assigned_user.full_name ||
                          request.assigned_user.email ||
                          request.assigned_user.phone ||
                          t("unknown")
                      )
                    ) : (
                      <AssignVolunteerDialog requestId={request.id} />
                    )}
                  </p>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {t("empty")}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </main>
);

}
