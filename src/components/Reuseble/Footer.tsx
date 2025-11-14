"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Mail, Facebook, Instagram } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const { locale } = useParams();
  const t = useTranslations("Footer");

  return (
    <footer className="w-full bg-cbg px-6 md:px-20 lg:px-40 py-6 text-cgreen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <Link
          href={`/${locale}/privacy`}
          className="text-sm hover:underline transition"
        >
          {t("privacy")}
        </Link>

        <Link
          href={`/${locale}/terms`}
          className="text-sm hover:underline transition"
        >
          {t("terms")}
        </Link>
      </div>
      <div className="mt-4 flex justify-center text-center px-4">
        <p className="text-sm md:text-base leading-relaxed">{t("description")}</p>
      </div>
      <div className="mt-4 flex justify-center gap-6">
        <Mail size={20} />
        <Facebook size={20} />
        <Instagram size={20} />
      </div>
      <div className="mt-4 flex justify-center">
        <p className="text-xs md:text-sm opacity-80">{t("copyright")}</p>
      </div>
    </footer>
  );
}
