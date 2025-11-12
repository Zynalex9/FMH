// src/hooks/request/useUpdateRequest.ts
import { updateRequestFn } from "@/queries/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  const t = useTranslations("response_messages");
  const { user } = useSelector((state: RootState) => state.user);

  return useMutation({
    mutationFn: async ({
      status,
      notes,
      requestId,
      proofUrls,
    }: {
      status: string;
      notes: string;
      requestId: string;
      proofUrls?: string[];
    }) => {
      const isVolunteer = user?.role === "volunteer";
      const isDelivered = status === "delivered";

      if (
        isVolunteer &&
        isDelivered &&
        (!proofUrls || proofUrls.length === 0)
      ) {
        throw new Error("PROOF_REQUIRED_FOR_DELIVERED");
      }

      return await updateRequestFn(status, notes, requestId, proofUrls);
    },

    onSuccess: (_data, variables) => {
      toast.success(t("request_updated"));
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
    },

    onError: (error: unknown) => {
      if (
        error instanceof Error &&
        error.message === "PROOF_REQUIRED_FOR_DELIVERED"
      ) {
        toast.error(t("uploadRequiredForDelivered"));
        return;
      }

      // Handle errors with a `code` property (like Supabase/PostgREST errors)
      if (typeof error === "object" && error !== null && "code" in error) {
        const errWithCode = error as { code: string };
        if (errWithCode.code === "PGRST116" || errWithCode.code === "42501") {
          toast.error(t("unauthorized"));
          return;
        }
      }

      toast.error(t("unexpected_error"));
    },
  });
}
