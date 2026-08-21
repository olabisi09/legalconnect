import { usePermission } from "@/hooks/use-permission";
import { Permission } from "@/lib/permissions";

export function PermissionGuard({
  permissions,
  children,
  areAllRequired = false,
  fallback,
}: {
  permissions: Permission[];
  children: React.ReactNode;
  areAllRequired?: boolean;
  fallback?: React.ReactNode;
}) {
  const { hasAny, hasAll } = usePermission();

  const hasAccess = areAllRequired ? hasAll(permissions) : hasAny(permissions);

  if (!hasAccess) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
