import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router";

interface Props {
  allowedRoles: UserRole[];
}
const RequireAuth = ({ allowedRoles }: Props) => {
  const location = useLocation();

  const { accessToken, roles } = useAuthStore();

  // 1. Not logged in? Send to login.
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Logged in but WRONG role? Send to unauthorized.
  const hasAccess = roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // 3. Logged in and correct role? Let them in!
  return <Outlet />;
};

export default RequireAuth;
