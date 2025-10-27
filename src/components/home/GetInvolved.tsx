"use client";

import { useTranslations } from "next-intl";
import { useGetParams } from "@/hook/useGetParams";
import Link from "next/link";

export default function GetInvolved() {
  const t = useTranslations("GetInvolved");
  const locale = useGetParams();

  return (
    <div className="mt-4">
      <h1 className="text-3xl font-semibold text-black">{t("title")}</h1>
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex gap-2">
          <Link
            href={`/${locale}/user-request`}
            className="bg-cgreen px-4 text-center py-2 rounded-xl text-sgreen cursor-pointer w-[10rem]"
          >
            {t("requestHelp")}
          </Link>
          <Link
            href={`/${locale}/support-offer`}
            className="bg-sgreen px-4 py-2 rounded-xl text-center text-cgreen cursor-pointer ml-1 block w-[10rem] "
          >
            {t("donate")}
          </Link>
        </div>
        <div>
          <Link
            href={`/${locale}/volunteer-signup`}
            className="bg-sgreen px-4 py-2 text-center rounded-xl text-cgreen block w-[10rem] cursor-pointer mt-4"
          >
            {t("volunteer")}
          </Link>
        </div>
      </div>
    </div>
  );
}
