import { create } from "zustand";
import type { UserRole } from "@/lib/types";

interface AuthState {
  id: string | null;
  user: string | null;
  roles: UserRole[];
  accessToken: string | null;
  loggedOut: boolean;
  setAuth: (auth: {
    id: string;
    user: string;
    roles: UserRole[];
    accessToken: string;
  }) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  user: null,
  roles: [],
  accessToken: null,
  loggedOut: false,
  setAuth: (auth) => set({ ...auth, loggedOut: false }),
  logOut: () =>
    set({
      id: null,
      user: null,
      roles: [],
      accessToken: null,
      loggedOut: true,
    }),
}));
