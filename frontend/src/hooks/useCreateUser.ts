import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/lib/types";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { CreateUserFields } from "@/validation/userSchema";

interface CreateUserResponse {
  message: string;
  id: string;
}

export const useCreateUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    CreateUserResponse,
    AxiosError<ApiErrorResponse>,
    CreateUserFields
  >({
    mutationFn: async (newUser) => {
      const response = await axiosPrivate.post<CreateUserResponse>(
        "/users",
        newUser,
      );

      return response.data;
    },

    onSuccess: (data) => {
      // Refresh the users list and any stats that depend on user counts
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("User Created", {
        description: data.message,
      });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data.message || "Failed to create user";

      toast.error(errorMessage);
    },
  });
};
