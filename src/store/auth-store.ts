import { ROLES } from "@/lib/enums";
import { Permission } from "@/lib/permissions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: (typeof ROLES)[number];
  orgId: string | null;
  orgName: string | null;
  mfaRequired: boolean;
  permissions: Permission[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  setAuthState: (state: { user: AuthState["user"] }) => void;
  setUser: (user: AuthState["user"]) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setAuthState: ({ user }) => set(() => ({ user, isAuthenticated: true })),
      setUser: (user) => set(() => ({ user })),
      clearAuthState: () => {
        set(() => ({
          isAuthenticated: false,
          user: null,
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
