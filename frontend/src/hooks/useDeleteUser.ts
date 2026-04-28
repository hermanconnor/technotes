import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { ApiErrorResponse } from "@/lib/types";

interface DeleteUserResponse {
  message: string;
}

export const useDeleteUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResponse, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (id: string) => {
      // Backend expects the ID in the body for DELETE /users
      const response = await axiosPrivate.delete<DeleteUserResponse>("/users", {
        data: { id },
      });

      return response.data;
    },

    onSuccess: (data) => {
      // Invalidate both users list and dashboard stats (total employees count)
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("User Removed", {
        description: data.message,
      });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";

      toast.error("Cannot Delete User", {
        description: errorMessage,
        // If it's a 400 (assigned notes), we can give them a hint
        action:
          error.response?.status === 400
            ? {
                label: "View Notes",
                onClick: () => (window.location.href = "/dashboard/notes"),
              }
            : undefined,
      });
    },
  });
};
