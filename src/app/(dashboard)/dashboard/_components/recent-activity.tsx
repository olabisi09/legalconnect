"use client";

import Link from "next/link";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { AppEmpty } from "@/components/app-empty";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/features/use-dashboard";
import {
  isClientDashboard,
  type ClientRecentActivity,
  type RecentActivity,
} from "@/types/dashboard";
import { formatRelativeTime } from "@/lib/formatter";
import {
  RiArrowRightSLine,
  RiFileLine,
  RiFolderLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiUserAddLine,
  RiWallet3Line,
} from "@remixicon/react";

const MAX_VISIBLE_ACTIVITY = 5;

function activityIcon(resourceType: string) {
  const t = resourceType.toLowerCase();
  if (t.includes("document")) return <RiFileLine className="h-3.5 w-3.5" />;
  if (t.includes("case") || t.includes("matter"))
    return <RiFolderLine className="h-3.5 w-3.5" />;
  if (t.includes("invite") || t.includes("user") || t.includes("team"))
    return <RiUserAddLine className="h-3.5 w-3.5" />;
  if (t.includes("invoice") || t.includes("billing") || t.includes("trust"))
    return <RiWallet3Line className="h-3.5 w-3.5" />;
  if (t.includes("audit") || t.includes("security"))
    return <RiShieldCheckLine className="h-3.5 w-3.5" />;
  return <RiInformationLine className="h-3.5 w-3.5" />;
}

function activityVerb(action: string) {
  return action.replaceAll("_", " ").toLowerCase();
}

export function RecentActivity({ className }: { className?: string }) {
  const { data, isLoading } = useDashboard();
  const activity: (RecentActivity | ClientRecentActivity)[] =
    data?.recentActivity ?? [];
  const showActor = !!data && !isClientDashboard(data);
  const visibleActivity = activity.slice(0, MAX_VISIBLE_ACTIVITY);

  return (
    <DashboardCard className={className}>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest actions across your workspace.</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            render={<Link href="/audit-logs" />}
          >
            See all
            <RiArrowRightSLine data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : visibleActivity.length ? (
          visibleActivity.map((entry) => (
            <div
              key={entry.id}
              className="-mx-2 flex items-start gap-3 rounded-[3px] px-2 py-2.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-lc-paper-warm text-lc-slate">
                {activityIcon(entry.resourceType)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-foreground">
                  <span className="font-medium capitalize">
                    {activityVerb(entry.action)}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {entry.resourceType.toLowerCase()}
                  </span>
                  {showActor && "actorEmail" in entry && (
                    <span className="text-muted-foreground">
                      {" "}
                      by {entry.actorEmail}
                    </span>
                  )}
                </p>
                <p className="font-plexmono text-[10.5px] text-muted-foreground">
                  {formatRelativeTime(entry.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8">
            <AppEmpty
              title="No recent activity"
              description="Actions taken on your cases will show up here."
              icon={<RiInformationLine />}
            />
          </div>
        )}
      </CardContent>
    </DashboardCard>
  );
}
