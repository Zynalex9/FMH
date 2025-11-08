import { updateRequestFn } from "@/queries/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  const t = useTranslations("response_messages");

  return useMutation({
    mutationFn: async ({
      status,
      notes,
      requestId,
    }: {
      status: string;
      notes: string;
      requestId: string;
    }) => await updateRequestFn(status, notes, requestId),

    onSuccess: (_data, variables) => {
      toast.success(t("request_updated"));
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
    },

    onError: (error: any) => {
      if (error.code === "PGRST116") {
        console.log(error)
        toast.error(t("invalid_status"));
      } else if (error.code === "42501") {
        console.log(error)
        toast.error(t("unauthorized"));
      } else {
        console.log(error)
        toast.error(t("unexpected_error"));
      }
    },
  });
}
