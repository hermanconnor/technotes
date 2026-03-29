import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type { InternalAxiosRequestConfig } from "axios";
import { axiosPrivate } from "../api/axios";
import { useRefreshToken } from "./useRefreshToken";
import { useAuthStore } from "../store/useAuthStore";

// Extend the Axios config type to include custom 'sent' flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

export const useAxiosPrivate = () => {
  const token = useAuthStore((state) => state.accessToken);
  const logOut = useAuthStore((state) => state.logOut);
  const refresh = useRefreshToken();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config as CustomAxiosRequestConfig;

        // Logic check: If status is 401 (Expired) and we haven't retried yet
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // Re-run the original request with the new token
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // If the refresh call itself fails (401), the session is totally dead
            logOut();
            navigate("/login", { state: { from: location }, replace: true });
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh, logOut, navigate, location]);

  return axiosPrivate;
};
