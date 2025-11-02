import { updateRequestFn } from "@/queries/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateRequest(
  status: string,
  notes: string,
  requestId: string
) {
    const queryClient = useQueryClient();
    return useMutation({

    mutationFn: async () => {
      const data = await updateRequestFn(status, notes, requestId);
      return data;
    },
    onSuccess: () => {
        toast.success("Request updated successfully");
        queryClient.invalidateQueries({ queryKey: ["request", requestId] });
    }
  });
}
