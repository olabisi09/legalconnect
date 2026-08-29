"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCaseDetails } from "@/hooks/features/use-cases";
import { formatDateString, formatDateTimeString } from "@/lib/formatter";
import { capitalize } from "@/lib/utils";
import { CaseDetail, Note } from "@/types/case";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiEditLine,
  RiExchangeLine,
  RiLockLine,
  RiMapPinLine,
  RiShieldCheckLine,
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
import { AddDeadlineModal } from "@/app/(dashboard)/cases/_components/add-deadline";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDocuments } from "@/hooks/features/use-documents";
import { UploadDocumentModal } from "../_components/upload-document";
import { DocumentDrawer } from "../_components/document-details";
import {
  deadlineColumns,
  partyColumns,
  teamColumns,
  transitionColumns,
  documentColumns,
} from "../case-utils";

export default function CaseDetails() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useCaseDetails(params?.id);
  const { data: documentsData, isLoading: isDocumentsLoading } = useDocuments(
    params?.id,
  );
  const caseDetail = data as CaseDetail;

  // Modal state management
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [applyHoldOpen, setApplyHoldOpen] = useState(false);
  const [removeHoldOpen, setRemoveHoldOpen] = useState(false);
  const [addDeadlineOpen, setAddDeadlineOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState("");
  const [documentDetailOpen, setDocumentDetailOpen] = useState(false);
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        Loading case...
      </div>
    );
  }

  const documents = documentsData?.content || [];
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
            <TabsTrigger value="documents">
              Documents ({documents?.length ?? 0})
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

          {/* Documents */}
          <TabsContent value="documents" className="mt-4">
            <div className="mb-3 flex justify-end">
              <UploadDocumentModal
                caseId={caseDetail?.id}
                open={uploadDocumentOpen}
                setOpen={setUploadDocumentOpen}
              />
            </div>
            <DataTable
              columns={documentColumns}
              data={documents}
              emptyComponent={
                <AppEmpty
                  title="No documents"
                  description="No documents uploaded for this case"
                >
                  <Button onClick={() => setUploadDocumentOpen(true)}>
                    <RiAddLine />
                    Add document
                  </Button>
                </AppEmpty>
              }
              loading={isDocumentsLoading}
              isRowClickable
              onRowClick={(row) => {
                setCurrentDocId(row.id);
                setDocumentDetailOpen(true);
              }}
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
      <DocumentDrawer
        caseId={caseDetail?.id}
        documentId={currentDocId}
        open={documentDetailOpen}
        onOpenChange={setDocumentDetailOpen}
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
