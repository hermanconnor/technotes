import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { EditUserFields } from "@/validation/userSchema";
import type { ApiErrorResponse } from "@/lib/types";

interface UpdateUserResponse {
  message: string;
}

type UpdateUserVariables = EditUserFields & { id: string };

export const useUpdateUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse,
    AxiosError<ApiErrorResponse>,
    UpdateUserVariables
  >({
    mutationFn: async (variables) => {
      const payload = { ...variables };

      if (payload.password === "") delete payload.password;

      const response = await axiosPrivate.patch<UpdateUserResponse>(
        "/users",
        payload,
      );

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("User Updated", {
        description: data.message,
      });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update user";
      toast.error(errorMessage);
    },
  });
};
