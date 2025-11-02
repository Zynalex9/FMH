import { capitalizeWords } from "@/lib/helper";
import { IRequest } from "@/types/types";

export function AdditionalInfoSection({
  request,
}: {
  request: IRequest | undefined;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div>
        <p className="text-sm text-muted-foreground px-4">Zone</p>
        <p className="font-medium bg-sgreen text-cgreen py-2 px-4 rounded-full inline-block">{request?.zone ? capitalizeWords(request.zone) : "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Priority</p>
        <p className="font-medium">{request?.priority ? capitalizeWords(request.priority) : "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Additional Notes</p>
        <p className="font-medium ">{request?.notes ? capitalizeWords(request.notes) : "N/A"}</p>
      </div>
    </div>
  );
}
