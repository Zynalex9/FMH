// src/hooks/request/useUpdateRequest.ts
import { updateRequestFn } from "@/queries/request";
import { queryKeys } from "@/lib/queryConfig";
import { IRequest } from "@/types/types";
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

    // Optimistic update for instant UI feedback
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.requests.detail(variables.requestId),
      });

      // Snapshot the previous value
      const previousRequest = queryClient.getQueryData<IRequest>(
        queryKeys.requests.detail(variables.requestId)
      );

      // Optimistically update to the new value
      if (previousRequest) {
        queryClient.setQueryData<IRequest>(
          queryKeys.requests.detail(variables.requestId),
          {
            ...previousRequest,
            status: variables.status,
            notes: variables.notes,
            ...(variables.proofUrls && { proof_urls: variables.proofUrls }),
          }
        );
      }

      return { previousRequest };
    },

    onSuccess: (_data, variables) => {
      toast.success(t("request_updated"));
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(variables.requestId),
      });
      // Also invalidate the list to reflect status changes
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.lists(),
      });
      // Invalidate assigned requests if user is assigned
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.requests.assigned(user.id),
        });
      }
    },

    onError: (error: unknown, variables, context) => {
      // Rollback on error
      if (context?.previousRequest) {
        queryClient.setQueryData(
          queryKeys.requests.detail(variables.requestId),
          context.previousRequest
        );
      }

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
