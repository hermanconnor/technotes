import { create } from "zustand";
import type { UserRole } from "@/lib/types";

interface AuthState {
  user: string | null;
  roles: UserRole[];
  accessToken: string | null;
  loggedOut: boolean;
  setAuth: (auth: {
    user: string;
    roles: UserRole[];
    accessToken: string;
  }) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  roles: [],
  accessToken: null,
  loggedOut: false,
  setAuth: (auth) => set({ ...auth, loggedOut: false }),
  logOut: () =>
    set({ user: null, roles: [], accessToken: null, loggedOut: true }),
}));
