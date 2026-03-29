import { jwtDecode } from "jwt-decode";
import { axiosPublic } from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginResponse, DecodedAccessToken } from "@/lib/types";

export const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = async (): Promise<string> => {
    const response = await axiosPublic.get<LoginResponse>("/auth/refresh", {
      withCredentials: true,
    });

    const { accessToken } = response.data;

    const decoded = jwtDecode<DecodedAccessToken>(accessToken);

    setAuth({
      user: decoded.userInfo.username,
      roles: decoded.userInfo.roles,
      accessToken,
    });

    return accessToken;
  };

  return refresh;
};
