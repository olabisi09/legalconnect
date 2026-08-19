"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMatterDetails } from "@/hooks/features/use-matters";
import { formatDate, formatDateTimeString } from "@/lib/formatter";
import { capitalize, cn } from "@/lib/utils";
import { MatterDetail, Party } from "@/types/matter";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiBuildingLine,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiEditLine,
  RiErrorWarningLine,
  RiExchangeLine,
  RiHistoryLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiShieldCheckLine,
  RiShieldLine,
  RiStarFill,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import { useParams } from "next/navigation";
import { ChangeStatusModal } from "@/app/(dashboard)/matters/_components/change-matter-status";
import { EditMatterModal } from "@/app/(dashboard)/matters/_components/edit-matter";
import {
  ApplyLegalHoldModal,
  RemoveLegalHoldModal,
} from "@/app/(dashboard)/matters/_components/legal-hold";

export default function MatterDetails() {
  const params = useParams<{ id: string }>();
  const now = new Date();
  const { data, isLoading } = useMatterDetails(params?.id);
  const matter = data as MatterDetail;

  // Modal state management
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [applyHoldOpen, setApplyHoldOpen] = useState(false);
  const [removeHoldOpen, setRemoveHoldOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        Loading matter...
      </div>
    );
  }

  const isOpenMatter = !matter?.closedAt;

  return (
    <div>
      <Link
        href="/matters"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <RiArrowLeftLine className="size-4" />
        Matters
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {matter?.matterNumber}
            </span>
            <StatusBadge status={matter?.status} />
            <PriorityBadge priority={matter?.priority} />
            {matter?.legalHold && (
              <Badge
                variant="outline"
                className="gap-1 border-red-200 bg-red-50 text-red-700"
              >
                <RiShieldCheckLine className="size-3.5" />
                Legal hold
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-semibold leading-tight">
            {matter?.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {matter?.practiceArea || "—"} · Opened{" "}
            {formatDate(matter?.openedAt)} · {matter?.jurisdictionCode || "—"}
          </p>
        </div>

        {/* TODO: gate these on matter.accessLevel (WRITE/FULL) per PRD 4.4.3 */}
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            onClick={() =>
              matter?.legalHold
                ? setRemoveHoldOpen(true)
                : setApplyHoldOpen(true)
            }
            className={
              matter?.legalHold
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                : ""
            }
          >
            <RiShieldCheckLine />
            {matter?.legalHold ? "Remove hold" : "Legal hold"}
          </Button>
          <Button variant="outline" onClick={() => setStatusModalOpen(true)}>
            <RiExchangeLine />
            Change status
          </Button>
          <Button variant="outline" onClick={() => setEditModalOpen(true)}>
            <RiEditLine />
            Edit matter
          </Button>
        </div>
      </div>

      {matter?.message && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <RiErrorWarningLine className="mt-0.5 size-4 shrink-0" />
          <span>{matter.message}</span>
        </div>
      )}

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <section className="rounded-lg border">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-medium">Overview</h2>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2">
              <OverviewRow
                icon={RiBriefcaseLine}
                label="Practice area"
                value={matter?.practiceArea || "—"}
              />
              <OverviewRow
                icon={RiMapPinLine}
                label="Jurisdiction"
                value={matter?.jurisdictionCode || "—"}
              />
              <OverviewRow
                icon={RiCalendarLine}
                label="Opened"
                value={formatDate(matter?.openedAt)}
              />
              <OverviewRow
                icon={RiCalendarCheckLine}
                label="Closed"
                value={
                  isOpenMatter ? (
                    <span className="text-green-700">Ongoing</span>
                  ) : (
                    formatDate(matter?.closedAt)
                  )
                }
              />
              <OverviewRow
                icon={RiShieldLine}
                label="Access level"
                value={matter?.accessLevel || "—"}
              />
            </div>
            {matter?.description && (
              <>
                <Separator />
                <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {matter.description}
                </p>
              </>
            )}
          </section>

          {/* Parties */}
          <section className="rounded-lg border">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-medium">
                Parties ({matter?.partyCount ?? matter?.parties?.length ?? 0})
              </h2>
            </div>
            {matter?.parties?.length === 0 ? (
              <EmptyState label="No parties on this matter" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2 font-medium">Name / Entity</th>
                    <th className="px-5 py-2 font-medium">Type</th>
                    <th className="px-5 py-2 font-medium">Contact</th>
                    <th className="px-5 py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {matter?.parties?.map((party) => (
                    <tr key={party.id} className="border-b last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            {party.entityType === "INDIVIDUAL" ? (
                              <RiUserLine className="size-4" />
                            ) : (
                              <RiBuildingLine className="size-4" />
                            )}
                          </div>
                          <span className="font-medium">
                            {partyDisplayName(party)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {party.partyType.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          {party.email && (
                            <span className="flex items-center gap-1.5">
                              <RiMailLine className="size-3.5" />
                              {party.email}
                            </span>
                          )}
                          {party.phone && (
                            <span className="flex items-center gap-1.5">
                              <RiPhoneLine className="size-3.5" />
                              {party.phone}
                            </span>
                          )}
                          {!party.email && !party.phone && "—"}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {party.primaryClient && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <RiStarFill className="size-3.5" />
                            Primary
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Team */}
          <section className="rounded-lg border">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-medium">
                Team ({matter?.teamCount ?? matter?.team?.length ?? 0})
              </h2>
            </div>
            {matter?.team?.length === 0 ? (
              <EmptyState label="No team members assigned" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2 font-medium">Name</th>
                    <th className="px-5 py-2 font-medium">Role</th>
                    <th className="px-5 py-2 font-medium">Access</th>
                  </tr>
                </thead>
                <tbody>
                  {matter?.team?.map((member) => (
                    <tr key={member.id} className="border-b last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <RiUserLine className="size-4" />
                          </div>
                          <span className="font-medium">{member.userName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {member.teamRole}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {member.accessLevel}
                          </Badge>
                          {member.ethicalWall && (
                            <span className="flex items-center gap-1 text-xs text-red-700">
                              <RiShieldLine className="size-3.5" />
                              Ethical wall
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Deadlines */}
          <section className="rounded-lg border">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-medium">
                Deadlines ({matter?.deadlines?.length ?? 0})
              </h2>
            </div>
            <div className="divide-y">
              {matter?.deadlines?.length === 0 ? (
                <EmptyState label="No deadlines on this matter" />
              ) : (
                matter?.deadlines?.map((deadline) => {
                  const isOverdue =
                    !deadline.completed &&
                    new Date(deadline.dueDate).getTime() < now.getTime();
                  return (
                    <div
                      key={deadline.id}
                      className={cn(
                        "flex items-start gap-3 px-5 py-3",
                        isOverdue && "bg-red-50/60",
                      )}
                    >
                      {deadline.completed ? (
                        <RiCheckboxCircleFill className="mt-0.5 size-4 shrink-0 text-green-600" />
                      ) : (
                        <RiTimeLine
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            isOverdue
                              ? "text-red-600"
                              : "text-muted-foreground",
                          )}
                        />
                      )}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-sm font-medium">{deadline.title}</p>
                        {deadline.description && (
                          <p className="text-xs text-muted-foreground">
                            {deadline.description}
                          </p>
                        )}
                        <p
                          className={cn(
                            "text-xs",
                            isOverdue
                              ? "font-medium text-red-600"
                              : "text-muted-foreground",
                          )}
                        >
                          {deadline.completed
                            ? `Completed ${formatDate(deadline.completedAt)}`
                            : `Due ${formatDate(deadline.dueDate)}${
                                isOverdue ? " · Overdue" : ""
                              }`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-lg border">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-medium">Activity</h2>
            </div>
            <div className="px-5 py-4">
              {matter?.timeline?.length === 0 ? (
                <EmptyState label="No activity recorded yet" />
              ) : (
                <ol className="relative space-y-6 border-l pl-5">
                  {matter?.timeline?.map((event) => (
                    <li key={event.id} className="relative">
                      <span className="bg-background absolute -left-6.75 flex size-4 items-center justify-center rounded-full border">
                        <RiHistoryLine className="size-2.5" />
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{event.title}</p>
                        <span className="text-muted-foreground text-xs">
                          {formatDateTimeString(event.timestamp)}
                        </span>
                        {event.description && (
                          <p className="text-muted-foreground text-xs">
                            {event.description}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          {event.actorName} ·{" "}
                          {event.eventType.replace(/_/g, " ")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <ChangeStatusModal
        matterId={matter?.id}
        currentStatus={matter?.status}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
      />
      <EditMatterModal
        matter={matter}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      <ApplyLegalHoldModal
        matterId={matter?.id}
        open={applyHoldOpen}
        onOpenChange={setApplyHoldOpen}
      />
      <RemoveLegalHoldModal
        matterId={matter?.id}
        open={removeHoldOpen}
        onOpenChange={setRemoveHoldOpen}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const badgeMap: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    INTAKE: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CLOSED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-purple-100 text-purple-700",
  };
  const className = badgeMap[status] ?? "";
  return <Badge className={className}>{capitalize(status)}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-700 border-slate-200",
    NORMAL: "bg-blue-100 text-blue-800 border-blue-200",
    HIGH: "bg-orange-100 text-orange-800 border-orange-200",
    URGENT: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <Badge
      variant="outline"
      className={variants[priority] ?? "bg-muted text-muted-foreground"}
    >
      {priority}
    </Badge>
  );
}

function partyDisplayName(party: Party) {
  if (party.entityType === "INDIVIDUAL") {
    return [party.firstName, party.lastName].filter(Boolean).join(" ") || "—";
  }
  return party.entityName || "—";
}

function OverviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </div>
      <div className="text-right sm:text-left">{value}</div>
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground px-5 py-8 text-center text-sm">
      {label}
    </div>
  );
}
