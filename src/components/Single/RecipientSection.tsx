import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IRequest } from "@/types/types";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export function RecipientSection({ request }: { request: IRequest | undefined }) {
  const t = useTranslations("RequestDetail.RecipientSection");
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("title")}</h2>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{request?.contact_name || "N/A"}</p>
            <p className="text-sm text-cgreen">{request?.contact_location || t("addressNotProvided")}</p>
            <p className="text-sm text-muted-foreground">{request?.contact_email || ""}</p>
            <p className="text-sm text-muted-foreground">{request?.contact_phone || ""}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label={t("call")}>
          <Phone className="w-5 h-5 text-cgreen" />
        </button>
      </div>
    </div>
  );
}