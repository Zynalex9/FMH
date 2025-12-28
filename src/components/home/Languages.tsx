"use client";

import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";

export default function Languages() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();
  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <section>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
        Languages
      </h1>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleLanguageChange("en")}
          className={`border px-6 py-2 rounded-xl transition
            ${locale === "en" ? "bg-cgreen text-white" : "bg-sgreen text-cgreen hover:bg-green-100"}
          `}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange("es")}
          className={`border px-6 py-2 rounded-xl transition
            ${locale === "es" ? "bg-cgreen text-white" : "bg-sgreen text-cgreen hover:bg-green-100"}
          `}
        >
          Spanish
        </button>
      </div>
    </section>
  );
}
