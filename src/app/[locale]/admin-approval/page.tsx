"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface PendingAdmin {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export default function AdminApprovalPage() {
  const t = useTranslations("AdminApproval");
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const response = await fetch("/api/admin/pending-admins");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setPendingAdmins(data.pendingAdmins || []);
    } catch (error) {
      console.error("Error fetching pending admins:", error);
      toast.error(t("fetchError") || "Failed to fetch pending admins");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch("/api/admin/approve-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "approve" }),
      });

      if (!response.ok) throw new Error("Failed to approve");

      toast.success(t("approveSuccess") || "Admin approved successfully");
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== userId));
    } catch (error) {
      console.error("Error approving admin:", error);
      toast.error(t("approveError") || "Failed to approve admin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch("/api/admin/approve-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "reject" }),
      });

      if (!response.ok) throw new Error("Failed to reject");

      toast.success(t("rejectSuccess") || "Admin rejected");
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== userId));
    } catch (error) {
      console.error("Error rejecting admin:", error);
      toast.error(t("rejectError") || "Failed to reject admin");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cgreen"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {t("title") || "Pending Admin Approvals"}
      </h1>

      {pendingAdmins.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-gray-500">
            {t("noPending") || "No pending admin approvals"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingAdmins.map((admin) => (
            <div
              key={admin.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {admin.full_name || "No name provided"}
                </p>
                <p className="text-sm text-gray-500">{admin.email}</p>
                {admin.phone && (
                  <p className="text-sm text-gray-400">{admin.phone}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {t("applied") || "Applied"}:{" "}
                  {new Date(admin.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(admin.id)}
                  disabled={actionLoading === admin.id}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === admin.id ? "..." : t("approve") || "Approve"}
                </button>
                <button
                  onClick={() => handleReject(admin.id)}
                  disabled={actionLoading === admin.id}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === admin.id ? "..." : t("reject") || "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
