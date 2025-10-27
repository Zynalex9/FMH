"use client";
import { useTranslations } from "next-intl";

export default function HelpSection() {
  const t = useTranslations("HomePage");
  return <div className="space-y-2">
    <h1 className="text-2xl font-medium mt-4 px-3">{t("help-title")}</h1>
    <p className="text-md text-center ">{t("help-sub-text")}</p>
  </div>;
}
