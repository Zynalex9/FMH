"use client";

import Image from "next/image";
import { HeartHandshake, Users, MapPin, HelpingHand } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  const values = [
    {
      icon: <HelpingHand className="w-8 h-8 text-cgreen" />,
      title: t("values.empathyTitle"),
      text: t("values.empathyText"),
    },
    {
      icon: <Users className="w-8 h-8 text-cgreen" />,
      title: t("values.communityTitle"),
      text: t("values.communityText"),
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-cgreen" />,
      title: t("values.transparencyTitle"),
      text: t("values.transparencyText"),
    },
    {
      icon: <MapPin className="w-8 h-8 text-cgreen" />,
      title: t("values.localImpactTitle"),
      text: t("values.localImpactText"),
    },
  ];

  const images = [
    { src: "/Image_anonymized.jpg", alt: "Volunteer helping" },
    { src: "/People_anonymized.jpg", alt: "Community members" },
    { src: "/packages.jfif", alt: "Donation packages" },
    { src: "/packages_box.jpeg", alt: "Packed boxes ready for delivery" },
    { src: "/car.jfif", alt: "Transportation for outreach" },
    { src: "/Clothes_anonymized.jpg", alt: "Clothing donations" },
  ];

  return (
    <main className="min-h-screen bg-cbg py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-black mb-4">{t("title")}</h1>
        <p className="text-cgreen text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <section className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-black text-center mb-4">
          {t("storyTitle")}
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
          {t("storyText")}
        </p>
      </section>
      <section className="max-w-5xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold text-black mb-3">
          {t("missionTitle")}
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
          {t("missionText")}
        </p>
      </section>

      <section className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-6">
        {values.map(({ icon, title, text }) => (
          <div
            key={title}
            className="bg-white rounded-xl shadow-sm p-6 text-left border border-cgreen hover:shadow-md transition-all"
          >
            <div className="mb-3">{icon}</div>
            <h3 className="text-lg font-semibold text-black mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{text}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold text-black mb-4">
          {t("joinTitle")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          {t("joinText")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map(({ src, alt }) => (
            <div key={src} className="relative w-full h-60 rounded-lg overflow-hidden shadow-md">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
