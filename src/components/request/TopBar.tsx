"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import React from "react";

interface RequestHeaderProps {
  tabState: string;
  setTabState: (value: string) => void;
}

export const RequestHeader: React.FC<RequestHeaderProps> = ({
  tabState,
  setTabState,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const isAdmin = user?.role === "admin";

  // Tabs config
  const tabs = [
    { id: "all-requests", label: "All Requests" },
    { id: "quick-entry", label: "Quick Entry" },
    { id: "support-offers", label: "Support Offers" },
  ];

  return (
    <div className="mb-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-semibold text-black">
          Requests
        </h1>
        <p className="text-xs sm:text-sm text-cgreen mt-1">
          {isAdmin
            ? "Manage and track community outreach requests."
            : "You can request for help in the given form."}
        </p>
      </div>

      <div className="mt-4 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-6 sm:gap-8 min-w-max px-2 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabState(tab.id)}
              className={`pb-2 text-sm sm:text-base font-medium transition-colors ${
                tabState === tab.id
                  ? "text-cgreen border-b-2 border-cgreen"
                  : "text-gray-500 hover:text-cgreen"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
