"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCaseDetails } from "@/hooks/features/use-cases";
import { formatDateString, formatDateTimeString } from "@/lib/formatter";
import { capitalize, cn } from "@/lib/utils";
import {
  CaseDetail,
  Deadline,
  Note,
  Party,
  Team,
  Transition,
} from "@/types/case";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiBuildingLine,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiEditLine,
  RiExchangeLine,
  RiLockLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiShieldCheckLine,
  RiShieldLine,
  RiStarFill,
  RiUserLine,
} from "@remixicon/react";
import { useParams } from "next/navigation";
import { ChangeStatusModal } from "@/app/(dashboard)/cases/_components/change-status";
import { EditCaseModal } from "@/app/(dashboard)/cases/_components/edit-case";
import {
  ApplyLegalHoldModal,
  RemoveLegalHoldModal,
} from "@/app/(dashboard)/cases/_components/legal-hold";
import { AppEmpty } from "@/components/app-empty";
import { Checkbox } from "@/components/ui/checkbox";
import { AddDeadlineModal } from "@/app/(dashboard)/cases/_components/add-deadline";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { features } from "@/components/data-table-features";

// Column definitions
const partyColumns: ColumnDef<typeof features, Party>[] = [
  {
    accessorKey: "name",
    header: "Name / Entity",
    cell: ({ row }) => {
      const party = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            {party.entityType === "INDIVIDUAL" ? (
              <RiUserLine className="size-4" />
            ) : (
              <RiBuildingLine className="size-4" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{partyDisplayName(party)}</span>
            {party.primaryClient && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                <RiStarFill className="size-3" />
                Primary
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "partyType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.partyType.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const party = row.original;
      return (
        <div className="flex flex-col gap-0.5 text-muted-foreground">
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
      );
    },
  },
];

const teamColumns: ColumnDef<typeof features, Team>[] = [
  {
    accessorKey: "userId",
    header: "Member",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <RiUserLine className="size-4" />
        </div>
        <span className="font-medium text-muted-foreground">
          {row.original.userId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "teamRole",
    header: "Role",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.teamRole}</span>
    ),
  },
  {
    accessorKey: "accessLevel",
    header: "Access",
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex flex-col items-start gap-1">
          <Badge variant="secondary" className="text-xs font-normal">
            {member.accessLevel}
          </Badge>
          {member.ethicalWall && (
            <span className="flex items-center gap-1 text-xs text-red-700">
              <RiShieldLine className="size-3.5" />
              Ethical wall
            </span>
          )}
        </div>
      );
    },
  },
];

const deadlineColumns: ColumnDef<typeof features, Deadline>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const deadline = row.original;
      const isOverdue =
        !deadline.completed &&
        new Date(deadline.dueDate).getTime() < Date.now();
      return (
        <div className="flex items-start gap-3">
          <Checkbox
            className="mt-0.5"
            checked={deadline.completed}
            disabled
            aria-label={`${deadline.title} completion status`}
          />
          <div className="min-w-0 space-y-0.5">
            <p className="font-medium">{deadline.title}</p>
            {deadline.description && (
              <p className="text-xs text-muted-foreground">
                {deadline.description}
              </p>
            )}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 text-xs",
                isOverdue
                  ? "font-medium text-red-600"
                  : "text-muted-foreground",
              )}
            >
              <RiCalendarLine className="size-3.5" />
              <span>
                {deadline.completed
                  ? `Completed ${formatDateString(deadline.completedAt)}`
                  : `Due ${formatDateString(deadline.dueDate)}${isOverdue ? " · Overdue" : ""}`}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => {
      const deadline = row.original;
      const isOverdue =
        !deadline.completed &&
        new Date(deadline.dueDate).getTime() < Date.now();
      if (deadline.completed) {
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      }
      if (isOverdue) {
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-700">Pending</Badge>;
    },
  },
];

const transitionColumns: ColumnDef<typeof features, Transition>[] = [
  {
    accessorKey: "fromStage",
    header: "From",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="font-medium">{row.original.fromStage || "—"}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.fromStatus || "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "toStage",
    header: "To",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="font-medium">{row.original.toStage || "—"}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.toStatus || "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.reason || "—"}
      </span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDateTimeString(row.original.timestamp)}
      </span>
    ),
  },
  {
    accessorKey: "override",
    header: "Override",
    cell: ({ row }) =>
      row.original.override ? (
        <Badge className="bg-amber-100 text-amber-700">Yes</Badge>
      ) : null,
  },
];

export default function CaseDetails() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useCaseDetails(params?.id);
  const caseDetail = data as CaseDetail;

  // Modal state management
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [applyHoldOpen, setApplyHoldOpen] = useState(false);
  const [removeHoldOpen, setRemoveHoldOpen] = useState(false);
  const [addDeadlineOpen, setAddDeadlineOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        Loading case...
      </div>
    );
  }

  const isOpenCase = !caseDetail?.closedAt;
  const canWriteCase = true;

  return (
    <div>
      <Link
        href="/cases"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <RiArrowLeftLine className="size-4" />
        Cases
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {caseDetail?.caseNumber}
            </span>
            <StatusBadge status={caseDetail?.status} />
            <PriorityBadge priority={caseDetail?.priority} />
            {caseDetail?.legalHold && (
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
            {caseDetail?.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {caseDetail?.practiceArea || "—"} · Opened{" "}
            {formatDateString(caseDetail?.openedAt)} ·{" "}
            {caseDetail?.jurisdictionCode || "—"}
          </p>
        </div>

        {/* TODO: gate these on case.accessLevel (WRITE/FULL) per PRD 4.4.3 */}
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            onClick={() =>
              caseDetail?.legalHold
                ? setRemoveHoldOpen(true)
                : setApplyHoldOpen(true)
            }
            className={
              caseDetail?.legalHold
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                : ""
            }
          >
            <RiShieldCheckLine />
            {caseDetail?.legalHold ? "Remove hold" : "Legal hold"}
          </Button>
          <Button variant="outline" onClick={() => setStatusModalOpen(true)}>
            <RiExchangeLine />
            Change status
          </Button>
          <Button variant="outline" onClick={() => setEditModalOpen(true)}>
            <RiEditLine />
            Edit case
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="mt-6">
        <section className="rounded-lg border">
          <div className="border-b px-5 py-3">
            <h2 className="text-sm font-medium">Overview</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <OverviewRow
              icon={RiBriefcaseLine}
              label="Practice area"
              value={caseDetail?.practiceArea || "—"}
            />
            <OverviewRow
              icon={RiMapPinLine}
              label="Jurisdiction"
              value={caseDetail?.jurisdictionCode || "—"}
            />
            <OverviewRow
              icon={RiCalendarLine}
              label="Opened"
              value={formatDateString(caseDetail?.openedAt)}
            />
            <OverviewRow
              icon={RiCalendarCheckLine}
              label="Closed"
              value={
                isOpenCase ? (
                  <span className="text-green-700">Ongoing</span>
                ) : (
                  formatDateString(caseDetail?.closedAt)
                )
              }
            />
          </div>
          {caseDetail?.description && (
            <>
              <Separator />
              <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {caseDetail.description}
              </p>
            </>
          )}
        </section>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="parties">
          <TabsList variant="line">
            <TabsTrigger value="parties">
              Parties (
              {caseDetail?.partyCount ?? caseDetail?.parties?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="team">
              Team ({caseDetail?.teamCount ?? caseDetail?.team?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="deadlines">
              Deadlines ({caseDetail?.deadlines?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="notes">
              Notes ({caseDetail?.notes?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="transitions">
              Transitions ({caseDetail?.transitions?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* Parties */}
          <TabsContent value="parties" className="mt-4">
            <DataTable
              columns={partyColumns}
              data={caseDetail?.parties ?? []}
              emptyText="No parties on this case."
            />
          </TabsContent>

          {/* Team */}
          <TabsContent value="team" className="mt-4">
            <DataTable
              columns={teamColumns}
              data={caseDetail?.team ?? []}
              emptyText="No team members assigned."
            />
          </TabsContent>

          {/* Deadlines */}
          <TabsContent value="deadlines" className="mt-4">
            <div className="mb-3 flex justify-end">
              {canWriteCase && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddDeadlineOpen(true)}
                >
                  <RiAddLine />
                  Add Deadline
                </Button>
              )}
            </div>
            <DataTable
              columns={deadlineColumns}
              data={caseDetail?.deadlines ?? []}
              emptyText="No deadlines for this case."
            />
          </TabsContent>

          {/* Notes */}
          <TabsContent value="notes" className="mt-4">
            {!caseDetail?.notes?.length ? (
              <AppEmpty
                title="No notes available"
                description="No notes have been added to this case yet."
              />
            ) : (
              <div className="space-y-3">
                {caseDetail.notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transitions */}
          <TabsContent value="transitions" className="mt-4">
            <DataTable
              columns={transitionColumns}
              data={caseDetail?.transitions ?? []}
              emptyText="No status transitions recorded."
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ChangeStatusModal
        caseId={caseDetail?.id}
        currentStatus={caseDetail?.status}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
      />
      <EditCaseModal
        case={caseDetail}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      <ApplyLegalHoldModal
        caseId={caseDetail?.id}
        open={applyHoldOpen}
        onOpenChange={setApplyHoldOpen}
      />
      <RemoveLegalHoldModal
        caseId={caseDetail?.id}
        open={removeHoldOpen}
        onOpenChange={setRemoveHoldOpen}
      />
      <AddDeadlineModal
        caseId={caseDetail?.id}
        open={addDeadlineOpen}
        onOpenChange={setAddDeadlineOpen}
      />
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <div className="rounded-lg border p-4 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RiUserLine className="size-3.5" />
          <span>{note.authorId}</span>
          <span>·</span>
          <span>{formatDateTimeString(note.createdAt)}</span>
        </div>
        {note.private && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <RiLockLine className="size-3.5" />
            Private
          </span>
        )}
      </div>
      <p className="leading-relaxed text-foreground">{note.content}</p>
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
