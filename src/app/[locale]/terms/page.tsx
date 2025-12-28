"use client";
import { useTranslations } from "next-intl";
export default function TermsPage() {
  const t = useTranslations("TermsPage");

  return (
    <section className="px-6 flex justify-center items-center flex-col py-16 text-black bg-cbg h-screen w-full">
      <h1 className="text-2xl text-cgreen font-semibold mb-4">
        {t("title")}
      </h1>

      <p className="text-sm leading-relaxed">{t("paragraph1")}</p>

      <p className="text-sm mt-4 leading-relaxed">{t("paragraph2")}</p>
    </section>
  );
}
