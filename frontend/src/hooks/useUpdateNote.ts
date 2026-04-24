import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { ApiErrorResponse, Note } from "@/lib/types";
import type { UpdateNoteFields } from "@/validation/noteSchema";

interface UpdateNoteResponse {
  message: string;
  note: Note;
}

type UpdateNoteVariables = UpdateNoteFields & { id: string };

export const useUpdateNote = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateNoteResponse,
    AxiosError<ApiErrorResponse>,
    UpdateNoteVariables
  >({
    mutationFn: async (variables) => {
      const response = await axiosPrivate.patch<UpdateNoteResponse>(
        "/notes",
        variables,
      );

      return response.data;
    },

    onSuccess: (data) => {
      // Refresh notes list and the dashboard stats cards
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("Ticket Updated", { description: data.message });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data.message || "Failed to update ticket";
      toast.error(errorMessage);
    },
  });
};
