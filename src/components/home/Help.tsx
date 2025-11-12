"use client";
import { useTranslations } from "next-intl";

export default function HelpSection() {
  const t = useTranslations("HomePage");

  return (
    <div className="space-y-2 px-6 sm:px-8 md:px-0 text-center md:text-left">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mt-4">
        {t("help-title")}
      </h1>
      <p className="text-sm sm:text-md md:text-base text-gray-700">
        {t("help-sub-text")}
      </p>
    </div>
  );
}
