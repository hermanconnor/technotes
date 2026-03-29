import { axiosPublic } from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogout = () => {
  const logOutStore = useAuthStore((state) => state.logOut);

  const logout = async () => {
    // 1. Clear the store immediately
    logOutStore();

    // 2. Clear persistence preference
    localStorage.removeItem("persist");

    try {
      // 3. Tell the backend to clear the 'jwt' cookie
      await axiosPublic.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error("Logout failed on server:", err);
    }
  };

  return logout;
};
