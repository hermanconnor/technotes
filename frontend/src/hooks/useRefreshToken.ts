import { jwtDecode } from "jwt-decode";
import { axiosPublic } from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { DecodedAccessToken } from "@/lib/types";

interface LoginResponse {
  accessToken: string;
}

export const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = async (): Promise<string | null> => {
    try {
      const response = await axiosPublic.get<LoginResponse>("/auth/refresh", {
        withCredentials: true,
      });

      const { accessToken } = response.data;
      const decoded = jwtDecode<DecodedAccessToken>(accessToken);

      setAuth({
        id: decoded.userInfo.id,
        user: decoded.userInfo.username,
        roles: decoded.userInfo.roles,
        accessToken,
      });

      return accessToken;
    } catch (err) {
      // If the refresh fails, the cookie is likely gone/expired.
      if (import.meta.env.DEV) {
        console.error("Refresh token rotation failed:", err);
      }
      localStorage.removeItem("persist");
      return null;
    }
  };

  return refresh;
};
