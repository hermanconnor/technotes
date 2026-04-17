import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { ApiErrorResponse } from "@/lib/types";

interface CreateNoteResponse {
  message: string;
  ticketNumber: string;
}

interface CreateNoteVariables {
  title: string;
  text: string;
  user?: string; // Optional for Admins/Managers
}

export const useCreateNote = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // useMutation<TData, TError, TVariables>
  return useMutation<
    CreateNoteResponse,
    AxiosError<ApiErrorResponse>,
    CreateNoteVariables
  >({
    mutationFn: async (newNote) => {
      const response = await axiosPrivate.post<CreateNoteResponse>(
        "/notes",
        newNote,
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("Ticket Created!", {
        description: `${data.message}. Ticket: #${data.ticketNumber}`,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create ticket";
      toast.error(errorMessage);
    },
  });
};
