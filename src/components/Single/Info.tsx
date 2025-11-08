import { capitalizeWords } from "@/lib/helper";
import { IRequest } from "@/types/types";
import { useTranslations } from "next-intl";

export function AdditionalInfoSection({
  request,
}: {
  request: IRequest | undefined;
}) {
  const t = useTranslations("RequestDetail.AdditionalInfoSection");

  const infoItems = [
    {
      label: t("zone"),
      value: request?.zone ? capitalizeWords(request.zone) : t("na"),
      bg: "bg-sgreen",
      text: "text-cgreen",
    },
    {
      label: t("priority"),
      value: request?.priority ? capitalizeWords(request.priority) : t("na"),
      bg: "bg-sgreen",
      text: "text-cgreen",
    },
    {
      label: t("additionalNotes"),
      value: request?.notes ? capitalizeWords(request.notes) : t("na"),
      bg: "bg-sgreen",
      text: "text-cgreen",
    },
    {
      label: t("need_type"),
      value: request?.need_type ? capitalizeWords(request.need_type) : t("na"),
      bg: "bg-sgreen",
      text: "text-cgreen",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 ${item.bg}`}
        >
          <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
          <p
            className={`font-semibold inline-block px-3 py-1 rounded-full ${item.text} bg-white/30 backdrop-blur-sm`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
