"use client";

import { HeartPulse, Mail, PhoneCall } from "lucide-react";
import IconBox from "./IconBox";
import { useTranslations } from "next-intl";

export default function ContactUs() {
  const t = useTranslations("ContactUs");

  return (
    <div className="my-4 py-5 w-full">
      <h1 className="text-2xl font-semibold text-black">{t("title")}</h1>
      <p className="text-sm text-black text-center">{t("subtitle")}</p>

      <div>
        <IconBox
          Icon={Mail}
          title={t("emailTitle")}
          text="support@communityconnect.org"
        />
        <IconBox Icon={PhoneCall} title={t("phoneTitle")} text="+123 456 789" />
      </div>
    </div>
  );
}
