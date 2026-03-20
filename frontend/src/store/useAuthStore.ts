import { create } from "zustand";

interface AuthState {
  user: string | null;
  roles: string[];
  accessToken: string | null;
  setAuth: (auth: {
    user: string;
    roles: string[];
    accessToken: string;
  }) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  roles: [],
  accessToken: null,
  setAuth: (auth) => set({ ...auth }),
  logOut: () => set({ user: null, roles: [], accessToken: null }),
}));
