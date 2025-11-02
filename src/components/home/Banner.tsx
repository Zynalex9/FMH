"use client";
import { getUser } from "@/store/AuthSlice";
import { AppDispatch } from "@/store/store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Banner() {
  const t = useTranslations("HomePage");

  return (
    <div
      className="relative bg-gray-800 w-full h-[85vh] rounded-xl border-0 flex flex-col items-center justify-center text-center px-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1963622/pexels-photo-1963622.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 rounded-xl"></div>

      <div className="relative z-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-md md:text-md text-gray-200">
          {t("sub-banner-text")}
        </p>
      </div>
    </div>
  );
}
