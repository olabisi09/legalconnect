"use client";

import { hasPermission, Permission } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

export function usePermission(required: Permission | Permission[]) {
  const permissions = useAuthStore((s) => s.user?.permissions || []);

  return hasPermission(permissions, required);
}
