import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import { useRefreshToken } from "@/hooks/useRefreshToken";
import { useAuthStore } from "@/store/useAuthStore";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const accessToken = useAuthStore((state) => state.accessToken);
  const loggedOut = useAuthStore((state) => state.loggedOut);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.warn("Silent refresh failed:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Only attempt refresh if:
    // 1. We don't have an access token in state
    // 2. The user hasn't manually clicked 'logout' in this session
    // 3. The localStorage "persist" hint exists
    const persistHint = localStorage.getItem("persist") === "true";

    if (!accessToken && !loggedOut && persistHint) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, refresh, loggedOut]);

  return isLoading ? (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Spinner UI */}
      <div className="relative size-16">
        <div className="border-primary/20 absolute inset-0 rounded-full border-4"></div>
        <div className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
      <h2 className="text-foreground mt-6 text-xl font-semibold tracking-wide">
        Securing Session
      </h2>
    </div>
  ) : (
    <Outlet />
  );
};

export default PersistLogin;
