"use client";
import { useTranslations } from "next-intl";
import { Heart, HandHelping, Users } from "lucide-react";

export default function OurServices() {
  const t = useTranslations("HomePage");

  const services = [
    {
      icon: <HandHelping className="w-8 h-8 text-black" />,
      title: t("assistance-title"),
      text: t("assistance-text"),
    },
    {
      icon: <Heart className="w-8 h-8 text-black" />,
      title: t("community-title"),
      text: t("community-text"),
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: t("volunteer-title"),
      text: t("volunteer-text"),
    },
  ];

  return (
    <section
      className="w-full py-4 px-6 text-center flex flex-col items-center mt-8"
    >
      {/* <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {t("our-services")}
      </h2>
      <p className="text-gray-600 mb-10 max-w-2xl">
        {t("our-services-text")}
      </p> */}

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-3 hover:bg-[var(--color-cbg)] transition-all border border-[var(--color-sgreen)] hover:border-[var(--color-cgreen)] rounded-2xl p-6 shadow-sm"
          >
            {service.icon}
            <h3 className="font-semibold text-gray-900 text-lg">
              {service.title}
            </h3>
            <p className="text-cgreen text-sm">{service.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
