"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAssignedRequests } from "@/hook/useGetAssignedRequests";
import { useTranslations } from "next-intl";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "requested":
      return "bg-sgreen text-black";
    case "picked up":
      return "bg-yellow-200 text-black";
    case "delivered":
      return "bg-green-200 text-black";
    default:
      return "bg-gray-200 text-black";
  }
};

export default function VolunteerDashboard() {
  const t = useTranslations("VolunteerDashboard");
  const { locale } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const { data: requests, isLoading, error } = useGetAssignedRequests(user?.id);
  const assignedRequests = useMemo(() => requests ?? [], [requests]);

  const handleRowClick = (id: string) => {
    router.push(`/${locale}/requests/${id}`);
  };

  return (
    <main className="min-h-screen bg-cbg p-6">
      <div className="w-full md:max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">{t("title")}</h1>
          <Button
            onClick={() => router.push(`/${locale}/profile`)}
            className="bg-cgreen hover:bg-cgreen/90"
          >
            {t("myProfile")}
          </Button>
        </div>

        {isLoading ? (
          <div className="border rounded-lg bg-cbg p-6 space-y-3">
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
            {t("error", { message: error.message })}
          </div>
        ) : assignedRequests.length === 0 ? (
          <div className="border rounded-lg bg-white text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("noRequests")}
            </h2>
            <p className="text-gray-500">
              {t("noRequestsDesc")}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-cbg">
            <Table>
              <TableHeader className="bg-cbg border-0">
                <TableRow className="border-0">
                  <TableHead className="text-black">{t("table.requestNumber")}</TableHead>
                  <TableHead className="text-cgreen">{t("table.needType")}</TableHead>
                  <TableHead className="text-cgreen">{t("table.zone")}</TableHead>
                  <TableHead className="text-cgreen">{t("table.source")}</TableHead>
                  <TableHead className="text-cgreen">{t("table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedRequests.map((req) => (
                  <TableRow
                    key={req.id}
                    onClick={() => handleRowClick(req.id)}
                    className="cursor-pointer hover:bg-sgreen/40 transition-colors border-b border-gray-200 last:border-b-0"
                  >
                    <TableCell className="py-4 text-black font-medium capitalize">
                      {req.request_number}
                    </TableCell>
                    <TableCell className="text-cgreen py-4 capitalize">
                      {req.need_type}
                    </TableCell>
                    <TableCell className="text-cgreen py-4 capitalize">
                      {req.zone}
                    </TableCell>
                    <TableCell className="text-cgreen py-4 capitalize">
                      {req.source}
                    </TableCell>
                    <TableCell className="py-4 capitalize">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}