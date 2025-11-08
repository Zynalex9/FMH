import { capitalizeWords } from "@/lib/helper";
import { IRequest } from "@/types/types";
import { useTranslations } from "next-intl";

export function AdditionalInfoSection({
  request,
}: {
  request: IRequest | undefined;
}) {
  const t = useTranslations("RequestDetail.AdditionalInfoSection");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div>
        <p className="text-sm text-muted-foreground px-4">{t("zone")}</p>
        <p className="font-medium bg-sgreen text-cgreen py-2 px-4 rounded-full inline-block">
          {request?.zone ? capitalizeWords(request.zone) : t("na")}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t("priority")}</p>
        <p className="font-medium">{request?.priority ? capitalizeWords(request.priority) : t("na")}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t("additionalNotes")}</p>
        <p className="font-medium">{request?.notes ? capitalizeWords(request.notes) : t("na")}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t("need_type")}</p>
        <p className="font-medium">{request?.need_type ? capitalizeWords(request.need_type) : t("na")}</p>
      </div>
    </div>
  );
}