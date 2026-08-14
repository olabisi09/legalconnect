"use client";

import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMatterDetails } from "@/hooks/features/use-matters";
import { formatDate, formatDateTimeString } from "@/lib/formatter";
import { capitalize } from "@/lib/utils";
import { MatterDetail, Party } from "@/types/matter";
import { Separator } from "@/components/ui/separator";
import {
  RiBriefcaseLine,
  RiBuildingLine,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
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

export function MatterDetailDrawer({
  matterId,
  open,
  onOpenChange,
}: {
  matterId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const now = new Date();
  const { data, isLoading } = useMatterDetails(matterId);

  const matter = data as MatterDetail;

  if (isLoading)
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;

  const isOpenMatter = !matter?.closedAt;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="flex h-full w-full max-w-xl flex-col overflow-hidden">
        <DrawerHeader className="sticky top-0 z-10 border-b px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-muted-foreground font-mono text-xs">
                {matter?.matterNumber}
              </p>
              <DrawerTitle className="text-lg leading-tight">
                {matter?.title}
              </DrawerTitle>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              <StatusBadge status={matter?.status} />
              <PriorityBadge priority={matter?.priority} />
            </div>
          </div>
          {matter?.legalHold && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
              <RiShieldCheckLine className="size-4" />
              Legal hold active
            </div>
          )}
          <DrawerDescription className="sr-only">
            Matter details, parties, team, deadlines, and timeline
          </DrawerDescription>
        </DrawerHeader>

        {matter?.message && (
          <div className="bg-amber-50 px-6 py-2.5 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <RiErrorWarningLine className="mt-0.5 size-4 shrink-0" />
              <span>{matter?.message}</span>
            </div>
          </div>
        )}

        <div className="transparent-scrollbar flex-1 overflow-auto px-6 py-4">
          <style>{`
            .transparent-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(120, 120, 120, 0.4) transparent;
            }
          `}</style>

          {/* Overview */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RiBriefcaseLine className="size-4" />
              Practice area
            </div>
            <div className="text-right">{matter?.practiceArea || "—"}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <RiMapPinLine className="size-4" />
              Jurisdiction
            </div>
            <div className="text-right">{matter?.jurisdictionCode || "—"}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <RiCalendarLine className="size-4" />
              Opened
            </div>
            <div className="text-right">{formatDate(matter?.openedAt)}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <RiCalendarCheckLine className="size-4" />
              Closed
            </div>
            <div className="text-right">
              {isOpenMatter ? (
                <span className="text-green-700">Ongoing</span>
              ) : (
                formatDate(matter?.closedAt)
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <RiShieldLine className="size-4" />
              Access level
            </div>
            <div className="text-right">{matter?.accessLevel || "—"}</div>
          </div>

          {matter?.description && (
            <>
              <Separator className="my-4" />
              <p className="text-sm leading-relaxed">{matter?.description}</p>
            </>
          )}

          <Separator className="my-4" />

          {/* Tabs */}
          <Tabs defaultValue="parties">
            <TabsList className="w-full">
              <TabsTrigger value="parties" className="flex-1">
                Parties ({matter?.partyCount})
              </TabsTrigger>
              <TabsTrigger value="team" className="flex-1">
                Team ({matter?.teamCount})
              </TabsTrigger>
              <TabsTrigger value="deadlines" className="flex-1">
                Deadlines ({matter?.deadlines?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1">
                Timeline
              </TabsTrigger>
            </TabsList>

            {/* Parties */}
            <TabsContent value="parties" className="mt-4 space-y-3">
              {matter?.parties?.length === 0 ? (
                <EmptyState label="No parties on this matter" />
              ) : (
                matter?.parties?.map((party) => (
                  <div
                    key={party.id}
                    className="flex items-start gap-3 rounded-md border p-3"
                  >
                    <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                      {party.entityType === "INDIVIDUAL" ? (
                        <RiUserLine className="size-4" />
                      ) : (
                        <RiBuildingLine className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium">
                          {partyDisplayName(party)}
                        </span>
                        {party.primaryClient && (
                          <RiStarFill className="size-3.5 shrink-0 text-amber-500" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {party.partyType.replace(/_/g, " ")}
                      </Badge>
                      <div className="text-muted-foreground flex flex-col gap-0.5 pt-1 text-xs">
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
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Team */}
            <TabsContent value="team" className="mt-4 space-y-3">
              {matter?.team?.length === 0 ? (
                <EmptyState label="No team members assigned" />
              ) : (
                matter?.team?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-start justify-between gap-3 rounded-md border p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                        <RiUserLine className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{member.userName}</p>
                        <p className="text-muted-foreground text-xs">
                          {member.teamRole}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
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
                  </div>
                ))
              )}
            </TabsContent>

            {/* Deadlines */}
            <TabsContent value="deadlines" className="mt-4 space-y-3">
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
                      className="flex items-start gap-3 rounded-md border p-3"
                    >
                      {deadline.completed ? (
                        <RiCheckboxCircleFill className="mt-0.5 size-4 shrink-0 text-green-600" />
                      ) : (
                        <RiTimeLine
                          className={`mt-0.5 size-4 shrink-0 ${
                            isOverdue ? "text-red-600" : "text-muted-foreground"
                          }`}
                        />
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium">{deadline.title}</p>
                        {deadline.description && (
                          <p className="text-muted-foreground text-xs">
                            {deadline.description}
                          </p>
                        )}
                        <p
                          className={`text-xs ${
                            isOverdue
                              ? "font-medium text-red-600"
                              : "text-muted-foreground"
                          }`}
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
            </TabsContent>

            {/* Timeline */}
            <TabsContent value="timeline" className="mt-4">
              {matter?.timeline?.length === 0 ? (
                <EmptyState label="No activity recorded yet" />
              ) : (
                <ol className="relative space-y-6 border-l pl-5">
                  {matter?.timeline?.map((event) => (
                    <li key={event.id} className="relative">
                      <span className="bg-background absolute -left-[27px] flex size-4 items-center justify-center rounded-full border">
                        <RiHistoryLine className="size-2.5" />
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{event.title}</p>
                          <span className="text-muted-foreground shrink-0 text-xs">
                            {formatDateTimeString(event.timestamp)}
                          </span>
                        </div>
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
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground rounded-md border border-dashed py-8 text-center text-sm">
      {label}
    </div>
  );
}
