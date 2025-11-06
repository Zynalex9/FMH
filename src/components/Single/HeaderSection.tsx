import { IRequest } from "@/types/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeaderSection({
  request,
  locale,
}: {
  request: IRequest | undefined;
  locale: string;
}) {
  const t = useTranslations("RequestDetail.HeaderSection");
  const updatedAt = request?.updated_at;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link
          href={`/${locale}/request`}
          className="text-cgreen hover:underline"
        >
          {t("requests")}
        </Link>
        <span>/</span>
        <span>Request #{request?.request_number}</span>
      </div>
      <h1 className="text-3xl font-bold mb-1">{request?.request_number}</h1>
      <p className="text-sm text-cgreen">
        {updatedAt
          ? `Updated ${formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}`
          : "Just now"}
      </p>
    </div>
  );
}
