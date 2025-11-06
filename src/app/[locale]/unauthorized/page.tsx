"use client";

import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const t = useTranslations("UnauthorizedPage");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cbg text-center px-6">
      <div className="p-6 bg-cgreen/10 rounded-full mb-6">
        <Lock className="w-10 h-10 text-cgreen" />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        {t("title")}
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        {t("description")}
      </p>
      <div className="flex items-center gap-3">
        <Link href="/en">
          <Button
            variant="outline"
            className="border-cgreen text-cgreen hover:bg-cgreen/10 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("goHome")}
          </Button>
        </Link>

        <Link href="/en/signin">
          <Button className="bg-cgreen hover:bg-cgreen/90 text-white">
            {t("signIn")}
          </Button>
        </Link>
      </div>
    </div>
  );
}