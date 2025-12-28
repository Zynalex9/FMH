"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PendingApprovalPage() {
  const t = useTranslations("PendingApproval");
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {t("title") || "Account Pending Approval"}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("description") ||
            "Your admin account has been created but is awaiting approval from a super admin. You'll receive an email once your account is activated."}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-block bg-cgreen text-white px-6 py-2 rounded-lg hover:bg-cgreen/90 transition-colors"
          >
            {t("returnHome") || "Return Home"}
          </Link>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
          >
            {t("signOut") || "Sign out and try another account"}
          </button>
        </div>
      </div>
    </div>
  );
}
