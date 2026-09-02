"use client";

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/features/use-dashboard";
import { isClientDashboard } from "@/types/dashboard";
import { formatCompactCurrency, formatInteger } from "@/lib/formatter";
import {
  RiAlarmWarningLine,
  RiBriefcase4Line,
  RiCalendarEventLine,
  RiExchangeDollarLine,
  RiFileList3Line,
  RiNotification2Line,
  RiTeamLine,
  RiTimeLine,
  type RemixiconComponentType,
} from "@remixicon/react";

type Stat = {
  label: string;
  value: string;
  hint: string;
  icon: RemixiconComponentType;
};

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <DashboardCard>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-normal text-xs tracking-wide text-muted-foreground">
          {stat.label}
        </CardTitle>
        <Icon className="size-4 text-lc-slate" />
      </CardHeader>
      <CardContent>
        <p className="font-plexmono text-2xl font-semibold tabular-nums">
          {stat.value}
        </p>
      </CardContent>
      <CardFooter className="rounded-none bg-background text-xs text-muted-foreground">
        {stat.hint}
      </CardFooter>
    </DashboardCard>
  );
}

function StatSkeleton() {
  return (
    <DashboardCard>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="size-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-16" />
      </CardContent>
      <CardFooter className="rounded-none bg-background">
        <Skeleton className="h-3 w-24" />
      </CardFooter>
    </DashboardCard>
  );
}

export function DashboardStats() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </>
    );
  }

  const stats: Stat[] = isClientDashboard(data)
    ? [
        {
          label: "Active cases",
          value: `${formatInteger(data.activeCases)} / ${formatInteger(data.totalCases)}`,
          hint: "Active vs. total cases",
          icon: RiBriefcase4Line,
        },
        {
          label: "Documents",
          value: formatInteger(data.totalDocuments),
          hint: "Across all your cases",
          icon: RiFileList3Line,
        },
        {
          label: "Outstanding balance",
          value: formatCompactCurrency(data.totalOutstanding),
          hint:
            data.totalOutstanding > 0
              ? "Payment due"
              : "Account in good standing",
          icon: RiExchangeDollarLine,
        },
        {
          label: "Notifications",
          value: formatInteger(data.unreadNotificationCount),
          hint: "Unread updates",
          icon: RiNotification2Line,
        },
      ]
    : [
        {
          label: "Active cases",
          value: `${formatInteger(data.activeCases)} / ${formatInteger(data.totalCases)}`,
          hint: "Active vs. total caseload",
          icon: RiBriefcase4Line,
        },
        {
          label: "Upcoming hearings",
          value: formatInteger(data.upcomingHearingsCount),
          hint: "Scheduled on the calendar",
          icon: RiCalendarEventLine,
        },
        {
          label: "Outstanding invoices",
          value: formatCompactCurrency(data.outstandingInvoiceTotal),
          hint:
            data.overdueInvoiceCount > 0
              ? `${data.overdueInvoiceCount} overdue`
              : "None overdue",
          icon: RiExchangeDollarLine,
        },
        {
          label: "Team seats",
          value: `${formatInteger(data.teamSize)} / ${formatInteger(data.seatLimit)}`,
          hint:
            data.pendingInvitations > 0
              ? `${data.pendingInvitations} pending invite${data.pendingInvitations > 1 ? "s" : ""}`
              : "All seats confirmed",
          icon: RiTeamLine,
        },
        {
          label: "Billable hours",
          value: `${formatInteger(data.billableHoursThisMonth)}h`,
          hint: "Logged this month",
          icon: RiTimeLine,
        },
        {
          label: "Open tasks",
          value: formatInteger(data.openTasksCount),
          hint:
            data.overdueTasksCount > 0
              ? `${data.overdueTasksCount} overdue`
              : "None overdue",
          icon: RiAlarmWarningLine,
        },
      ];

  return (
    <>
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </>
  );
}
