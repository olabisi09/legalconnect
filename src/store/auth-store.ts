import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  orgId: string | null;
  orgName: string | null;
  mfaRequired: boolean;
  permissions: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;

  setAuthState: (state: {
    user: AuthState["user"];
    accessToken?: string | null;
  }) => void;
  setUser: (user: AuthState["user"]) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,

      setAuthState: ({ user, accessToken = null }) =>
        set(() => ({ user, isAuthenticated: true, accessToken })),
      setUser: (user) => set(() => ({ user })),
      clearAuthState: () => {
        set(() => ({
          isAuthenticated: false,
          user: null,
          accessToken: null,
        }));

        if (typeof window !== "undefined") {
          void fetch("/api/auth/session", {
            method: "DELETE",
            credentials: "include",
          });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
