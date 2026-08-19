import { usePermission } from "@/hooks/use-permission";
import { Permission } from "@/lib/permissions";

export function PermissionGuard({
  permissions,
  children,
}: {
  permissions: Permission | Permission[];
  children: React.ReactNode;
}) {
  const hasAccess = usePermission(permissions);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
