import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

const PublicOnly = () => {
  const token = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  return token ? <Navigate to={from} replace /> : <Outlet />;
};

export default PublicOnly;
