"use client";

import { useOrgProfile } from "@/hooks/features/use-orgs"; // adjust path to wherever this actually lives
import { Skeleton } from "@/components/ui/skeleton";
import { RiAlertLine, RiArchiveLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { TeamSection } from "./_components/team";

type StatusTone = "positive" | "negative" | "neutral";

function statusTone(value: string): StatusTone {
  const v = value.toUpperCase();
  if (["ACTIVE", "CURRENT", "VERIFIED"].includes(v)) return "positive";
  if (
    [
      "ARCHIVED",
      "SUSPENDED",
      "CANCELED",
      "CANCELLED",
      "PAST_DUE",
      "DELINQUENT",
    ].includes(v)
  )
    return "negative";
  return "neutral";
}

const toneStyles: Record<StatusTone, string> = {
  positive: "bg-lc-ledger-pale text-lc-ledger",
  negative: "bg-lc-stamp/12 text-lc-stamp",
  neutral: "bg-secondary text-muted-foreground",
};

function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plexmono text-[10px] uppercase tracking-wide ${toneStyles[statusTone(value)]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value.replaceAll("_", " ")}
    </span>
  );
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function LedgerRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
      <span className="font-plexmono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-[13.5px] text-foreground ${mono ? "font-plexmono text-[12.5px]" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}

function OrgProfileSkeleton() {
  return (
    <div>
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-3 h-8 w-72" />
      <Skeleton className="mt-2 h-4 w-48" />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[3px] border border-border p-6">
          <Skeleton className="h-3 w-24" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-[3px] border border-border p-6">
          <Skeleton className="h-3 w-24" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[3px] border border-lc-stamp/30 bg-lc-stamp/5 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-lc-stamp text-lc-stamp">
        <RiAlertLine className="h-5 w-5" />
      </span>
      <div>
        <p className="font-newsreader text-lg font-medium text-foreground">
          Unable to load this file
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          The organization record couldn&apos;t be retrieved. Try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export default function OrgProfile() {
  const user = useAuthStore((s) => s?.user);
  const orgId = user?.orgId as string;
  const { data: org, isLoading, isError, refetch } = useOrgProfile(orgId);

  if (isLoading) {
    return <OrgProfileSkeleton />;
  }

  if (isError || !org) {
    return <OrgProfileError onRetry={() => refetch()} />;
  }

  const seatsUsed =
    org.maxUsers > 0 ? Math.min(org.activeUserCount / org.maxUsers, 1) : 0;
  const nearCapacity =
    org.maxUsers > 0 && org.activeUserCount / org.maxUsers >= 0.9;
  const isArchived = Boolean(org.archivedAt);

  return (
    <div>
      {/* Header */}
      <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        § Organization
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-newsreader text-[28px] font-medium text-foreground">
          {org.name}
        </h1>
        <StatusBadge value={org.status} />
      </div>
      <p className="mt-1.5 font-plexmono text-[12.5px] text-muted-foreground">
        @{org.slug} · {org.type.replaceAll("_", " ")}
      </p>

      {/* Archived notice */}
      {isArchived ? (
        <div className="mt-6 flex items-start gap-3.5 rounded-[3px] border border-lc-stamp/30 bg-lc-stamp/5 px-5 py-4">
          <RiArchiveLine className="mt-0.5 h-4 w-4 shrink-0 text-lc-stamp" />
          <div>
            <p className="text-sm font-medium text-lc-stamp">
              Archived {formatDate(org.archivedAt)}
            </p>
            {org.archivedReason ? (
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {org.archivedReason}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Detail grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Identity */}
        <div className="rounded-[3px] border border-border p-6">
          <p className="mb-1 font-plexmono text-[10.5px] uppercase tracking-wide text-muted-foreground">
            Identity
          </p>
          <div className="mt-3">
            <LedgerRow label="Organization ID" value={org.id} mono />
            <LedgerRow label="Owner ID" value={org.ownerId} mono />
            <LedgerRow label="Jurisdiction" value={org.jurisdiction} />
            <LedgerRow label="Created" value={formatDate(org.createdAt)} mono />
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-[3px] border border-border p-6">
          <p className="mb-1 font-plexmono text-[10.5px] uppercase tracking-wide text-muted-foreground">
            Contact
          </p>
          <div className="mt-3">
            <LedgerRow label="Primary email" value={org.primaryEmail} />
            <LedgerRow label="Primary phone" value={org.primaryPhone} />
            <LedgerRow label="Billing email" value={org.billingEmail} />
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="mt-6 rounded-[3px] border border-lc-ledger bg-lc-ledger-pale/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-plexmono text-[10.5px] uppercase tracking-wide text-lc-ledger">
              Subscription
            </p>
            <p className="mt-1 font-newsreader text-xl font-medium text-foreground">
              {org.subscriptionTier.replaceAll("_", " ")}
            </p>
          </div>
          <StatusBadge value={org.subscriptionStatus} />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between font-plexmono text-[11px] text-muted-foreground">
            <span>SEATS USED</span>
            <span>
              {org.activeUserCount} / {org.maxUsers}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-lc-ink/10">
            <div
              className={`h-full rounded-full ${nearCapacity ? "bg-lc-stamp" : "bg-lc-ledger"}`}
              style={{ width: `${seatsUsed * 100}%` }}
            />
          </div>
          {nearCapacity ? (
            <p className="mt-2 text-[12.5px] text-lc-stamp">
              Nearing your seat limit — consider upgrading your plan.
            </p>
          ) : null}
        </div>
      </div>

      {/* Team */}
      <div className="mt-10">
        <TeamSection />
      </div>
    </div>
  );
}
