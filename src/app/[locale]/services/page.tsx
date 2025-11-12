"use client";

import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  HandHeart,
  ClipboardList,
  Truck,
  Users,
  HeartHandshake,
  BarChart3,
} from "lucide-react";

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;

  const handleNavigation = (path: string) => {
    if (locale) router.push(`/${locale}/${path}`);
  };

  const services = [
    {
      icon: <HandHeart className="w-6 h-6 text-cgreen" />,
      title: t("services.request.title"),
      description: t("services.request.description"),
      buttonText: t("services.request.button"),
      path: "user-request",
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-cgreen" />,
      title: t("services.admin.title"),
      description: t("services.admin.description"),
      buttonText: t("services.admin.button"),
      path: "request",
    },
    {
      icon: <Users className="w-6 h-6 text-cgreen" />,
      title: t("services.volunteer.title"),
      description: t("services.volunteer.description"),
      buttonText: t("services.volunteer.button"),
      path: "volunteer-signup",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-cgreen" />,
      title: t("services.donor.title"),
      description: t("services.donor.description"),
      buttonText: t("services.donor.button"),
      path: "support-offer",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cgreen" />,
      title: t("services.dashboard.title"),
      description: t("services.dashboard.description"),
      buttonText: t("services.dashboard.button"),
      path: "volunteer/dashboard",
    },
  ];

  return (
    <section className="w-full py-20 bg-cbg px-6 md:px-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-4">
          {t("header.title")}
        </h1>
        <p className="text-gray-600 text-base">{t("header.subtitle")}</p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-6 border rounded-2xl shadow-sm hover:shadow-md transition bg-white"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                {service.icon}
                <h2 className="text-lg font-semibold text-black">
                  {service.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {service.description}
              </p>
            </div>

            <Button
              className="bg-cgreen text-white hover:bg-cgreen/90 mt-auto"
              onClick={() => service.path && handleNavigation(service.path)}
            >
              {service.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-black mb-3">
          {t("cta.title")}
        </h2>
        <p className="text-gray-600 mb-6">{t("cta.description")}</p>
        <div className="flex justify-center gap-3">
          <Button
            className="bg-cgreen text-white hover:bg-cgreen/90"
            onClick={() => handleNavigation("volunteer-signup")}
          >
            {t("cta.volunteer")}
          </Button>
          <Button
            variant="outline"
            className="border-cgreen text-cgreen hover:bg-cgreen hover:text-white"
            onClick={() => handleNavigation("support-offer")}
          >
            {t("cta.donate")}
          </Button>
        </div>
      </div>
    </section>
  );
}
