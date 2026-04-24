import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { ApiErrorResponse } from "@/lib/types";

interface DeleteNoteResponse {
  message: string;
}

export const useDeleteNote = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<DeleteNoteResponse, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (id: string) => {
      const response = await axiosPrivate.delete<DeleteNoteResponse>("/notes", {
        data: { id },
      });

      return response.data;
    },

    onSuccess: (data) => {
      // Refresh the notes list and the dashboard stats
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("Ticket Deleted", {
        description: data.message,
      });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete ticket";

      toast.error(errorMessage, {
        description:
          "Verify you have the correct permissions to remove this note.",
      });
    },
  });
};
