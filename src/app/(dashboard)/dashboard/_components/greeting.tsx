"use client";

import { CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";
import { useAuthStore } from "@/store/auth-store";
import { useDashboard } from "@/hooks/features/use-dashboard";
import { isClientDashboard } from "@/types/dashboard";
import { DASHBOARD_LOCALE } from "@/lib/formatter";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting({ className }: { className?: string }) {
  const user = useAuthStore((s) => s.user);
  const { data } = useDashboard();

  const today = new Date().toLocaleDateString(DASHBOARD_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const subscriptionTier =
    data && !isClientDashboard(data) ? data.subscriptionTier : null;
  const subscriptionStatus =
    data && !isClientDashboard(data) ? data.subscriptionStatus : null;

  return (
    <DashboardCard className={className}>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-plexmono text-[11px] uppercase tracking-wider text-lc-slate">
            {today}
          </p>
          <h1 className="font-newsreader text-2xl font-medium text-foreground">
            {greetingForHour(new Date().getHours())}
            {user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          {user?.orgName && (
            <p className="text-xs text-muted-foreground">{user.orgName}</p>
          )}
        </div>
        {subscriptionTier && subscriptionStatus && (
          <div className="flex items-center gap-2">
            <span className="font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
              {subscriptionTier.toLowerCase()} plan
            </span>
            <StatusBadge value={subscriptionStatus} />
          </div>
        )}
      </CardContent>
    </DashboardCard>
  );
}
