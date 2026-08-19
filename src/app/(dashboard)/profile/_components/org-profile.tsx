import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrgProfile } from "@/hooks/features/use-orgs";
import { formatDateString } from "@/lib/formatter";
import { capitalize } from "@/lib/utils";
import { OrganizationDetail } from "@/types/organization";
import { RiArchiveLine } from "@remixicon/react";

export function OrgProfile({ orgId }: { orgId: string }) {
  const { data, isLoading } = useOrgProfile(orgId);

  const org = data as OrganizationDetail;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {org.archivedAt ? (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <RiArchiveLine className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">
              Archived on {formatDateString(org.archivedAt)}
            </p>
            {org.archivedReason ? (
              <p className="mt-0.5 text-destructive/80">{org.archivedReason}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div>
        <p className="font-newsreader text-lg font-medium text-foreground">
          {org.name}
        </p>
        <p className="font-plexmono text-xs text-muted-foreground">
          {org.slug}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">{capitalize(org.type)}</Badge>
        <Badge variant="secondary">{capitalize(org.status)}</Badge>
        <Badge variant="secondary">
          {capitalize(org.subscriptionTier)} plan
        </Badge>
        <Badge variant="secondary">{capitalize(org.subscriptionStatus)}</Badge>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Primary Email</dt>
          <dd className="text-sm">{org.primaryEmail}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Primary Phone</dt>
          <dd className="text-sm">{org.primaryPhone}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Billing Email</dt>
          <dd className="text-sm">{org.billingEmail}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Jurisdiction</dt>
          <dd className="text-sm">{org.jurisdiction}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Seats</dt>
          <dd className="text-sm">
            {org.activeUserCount} / {org.maxUsers} active
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Created</dt>
          <dd className="text-sm">{formatDateString(org.createdAt)}</dd>
        </div>
      </dl>
    </div>
  );
}
