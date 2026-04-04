import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { useAuthStore } from "../store/useAuthStore";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const accessToken = useAuthStore((state) => state.accessToken);
  const loggedOut = useAuthStore((state) => state.loggedOut);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.warn("Session refresh failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!accessToken && !loggedOut) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, refresh, loggedOut]);

  return isLoading ? (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* A nice glowing spinner */}
      <div className="relative h-16 w-16">
        <div className="border-primary/20 absolute inset-0 rounded-full border-4"></div>
        <div className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>

      <h2 className="text-foreground mt-6 text-xl font-semibold tracking-wide">
        Securing Session
      </h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Verifying your credentials...
      </p>
    </div>
  ) : (
    <Outlet />
  );
};

export default PersistLogin;
