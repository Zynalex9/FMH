"use client";
import AllAnalytics from "@/components/admin/AllAnalytics";
import RequestForm from "@/components/request/RequestForm";
import { SupportOffersTable } from "@/components/request/SupportOfferTable";
import RequestsPage from "@/components/request/Table";
import { RequestHeader } from "@/components/request/TopBar";
import { useState } from "react";

export default function Page() {
  const [tabState, setTabState] = useState("all-requests");

  return (
    <div className="bg-cbg pt-24 px-6 md:px-32">
      <RequestHeader tabState={tabState} setTabState={setTabState} />
      {tabState === "quick-entry" && <RequestForm />}
      {tabState === "all-requests" && <RequestsPage />}
      {tabState === "support-offers" && <SupportOffersTable />}
      {tabState === "all-analytics" && <AllAnalytics />}
    </div>
  );
}
