import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { axiosPublic } from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  ApiErrorResponse,
  DecodedAccessToken,
  LoginCredentials,
  LoginResponse,
} from "@/lib/types";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    LoginCredentials
  >({
    mutationFn: async (credentials) => {
      const response = await axiosPublic.post<LoginResponse>(
        "/auth/login",
        credentials,
      );

      return response.data;
    },

    onSuccess: (data, variables) => {
      const { accessToken } = data;
      const decoded = jwtDecode<DecodedAccessToken>(accessToken);

      setAuth({
        user: decoded.userInfo.username,
        roles: decoded.userInfo.roles,
        accessToken,
      });

      localStorage.setItem("persist", JSON.stringify(variables.persist));

      queryClient.clear();
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      console.error("Login failed:", errorMessage);
    },
  });
};
