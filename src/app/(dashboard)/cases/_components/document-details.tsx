"use client";

/**
 * Status-transition UI here is intentionally conservative. The screenshot flags that
 * allowed-transition rules aren't visible from the controller, so rather than exposing
 * a dropdown of all 9 statuses (an "arbitrary status-jump UI"), this computes a single
 * best-guess "next" action from the linear order given:
 *
 *   CREATED → UPLOADED → DRAFT → REVIEW → APPROVED → PUBLISHED → SUPERSEDED → ARCHIVED → DESTROYED
 *
 * REVIEW forks into explicit Approve/Reject actions instead of a generic "advance."
 * REJECTED offers a single "Send back to draft" action (assumed, not confirmed) rather
 * than continuing the forward chain into PUBLISHED, which wouldn't make sense.
 * Confirm all of this against the real transition rules before shipping.
 */

import { useState } from "react";
import {
  RiDownload2Line,
  RiLockLine,
  RiLockUnlockLine,
  RiFileAddLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiHistoryLine,
} from "@remixicon/react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { StatusBadge } from "@/components/status-badge";
import { ConfidentialityBadge } from "./confidentiality-badge";
import { UploadVersionDialog } from "./upload-version";
import { ShareDocumentDialog } from "./share-document";
import { formatBytes, formatDate, formatDateTimeString } from "@/lib/formatter";
import {
  useDocumentDetail,
  useDocumentTransition,
  useCheckOutDocument,
  useCheckInDocument,
  useDownloadDocument,
} from "@/hooks/features/use-documents";
import type { DocumentStatus } from "@/types/document";

const NEXT_STATUS: Partial<Record<DocumentStatus, DocumentStatus>> = {
  CREATED: "UPLOADED",
  UPLOADED: "DRAFT",
  DRAFT: "REVIEW",
  APPROVED: "PUBLISHED",
  PUBLISHED: "SUPERSEDED",
  SUPERSEDED: "ARCHIVED",
  ARCHIVED: "DESTROYED",
};

function LedgerRow({
  label,
  value,
  mono = false,
  title,
}: {
  label: string;
  value: string;
  mono?: boolean;
  title?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0">
      <span className="font-plexmono text-[10.5px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        title={title}
        className={`max-w-55 truncate text-[13px] text-foreground ${mono ? "font-plexmono text-[12px]" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}

function TransitionDialog({
  documentId,
  status,
  onOpenChange,
  title,
  actionLabel,
  destructive = false,
}: {
  documentId: string;
  status: DocumentStatus;
  onOpenChange: (open: boolean) => void;
  title: string;
  actionLabel: string;
  destructive?: boolean;
}) {
  const [reason, setReason] = useState("");
  const transition = useDocumentTransition();

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            {title}
          </DialogTitle>
          <DialogDescription>
            A reason gets recorded on the audit log.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          rows={3}
        />

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={transition.isPending}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            className={
              destructive
                ? "bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
                : "bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            }
            loading={transition.isPending}
            loadingText="Updating..."
            onClick={async () => {
              await transition.mutateAsync({
                id: documentId,
                newStatus: status,
                reason: reason || undefined,
              });
              onOpenChange(false);
            }}
          >
            {actionLabel}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-6 px-6 py-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-56" />
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function DocumentDrawer({
  caseId,
  documentId,
  open,
  onOpenChange,
}: {
  caseId: string;
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: doc, isLoading, isError } = useDocumentDetail(documentId);
  const checkOut = useCheckOutDocument();
  const checkIn = useCheckInDocument();
  const download = useDownloadDocument();

  const [pendingTransition, setPendingTransition] = useState<{
    status: DocumentStatus;
    title: string;
    actionLabel: string;
    destructive?: boolean;
  } | null>(null);
  const [uploadVersionOpen, setUploadVersionOpen] = useState(false);

  const status = doc?.status as DocumentStatus | undefined;
  const nextStatus = status ? NEXT_STATUS[status] : undefined;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="ml-auto h-full w-full max-w-lg rounded-none border-l border-border">
          {isLoading ? (
            <DrawerSkeleton />
          ) : isError || !doc ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <RiAlertLine className="h-6 w-6 text-lc-stamp" />
              <p className="text-sm text-muted-foreground">
                Couldn&apos;t load this document.
              </p>
            </div>
          ) : (
            <>
              <DrawerHeader className="border-b border-border text-left">
                <p className="font-plexmono text-[10.5px] uppercase tracking-wide text-primary">
                  § Document
                </p>
                <DrawerTitle className="font-newsreader text-xl font-medium">
                  {doc.fileName}
                </DrawerTitle>
                <DrawerDescription className="flex flex-wrap items-center gap-2 pt-1">
                  <StatusBadge value={doc.status} />
                  <ConfidentialityBadge value={doc.confidentiality} />
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => await download.mutateAsync(doc.id)}
                  >
                    <RiDownload2Line className="mr-1.5 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={checkOut.isPending}
                    onClick={() => checkOut.mutate(doc.id)}
                  >
                    <RiLockLine className="mr-1.5 h-4 w-4" />
                    Check out
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={checkIn.isPending}
                    onClick={() => checkIn.mutate(doc.id)}
                  >
                    <RiLockUnlockLine className="mr-1.5 h-4 w-4" />
                    Check in
                  </Button>
                  <ShareDocumentDialog documentId={doc.id} />
                </div>

                {/* Lifecycle action */}
                <div className="mt-5">
                  {status === "REVIEW" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-lc-ledger text-lc-paper hover:bg-lc-ledger/90"
                        onClick={() =>
                          setPendingTransition({
                            status: "APPROVED",
                            title: "Approve document",
                            actionLabel: "Approve",
                          })
                        }
                      >
                        <RiCheckLine className="mr-1.5 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-lc-stamp/40 text-lc-stamp hover:bg-lc-stamp/10"
                        onClick={() =>
                          setPendingTransition({
                            status: "REJECTED",
                            title: "Reject document",
                            actionLabel: "Reject",
                            destructive: true,
                          })
                        }
                      >
                        <RiCloseLine className="mr-1.5 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  ) : status === "REJECTED" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setPendingTransition({
                          status: "DRAFT",
                          title: "Send back to draft",
                          actionLabel: "Send back to draft",
                        })
                      }
                    >
                      Send back to draft
                    </Button>
                  ) : status === "DESTROYED" ? (
                    <p className="text-sm text-muted-foreground">
                      This document has been destroyed. No further actions
                      available.
                    </p>
                  ) : nextStatus ? (
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
                      onClick={() =>
                        setPendingTransition({
                          status: nextStatus,
                          title: `Move to ${nextStatus}`,
                          actionLabel: `Move to ${nextStatus.charAt(0)}${nextStatus.slice(1).toLowerCase()}`,
                        })
                      }
                    >
                      Advance to {nextStatus.charAt(0)}
                      {nextStatus.slice(1).toLowerCase()}
                    </Button>
                  ) : null}
                </div>

                {/* Metadata */}
                <div className="mt-6 rounded-[3px] border border-border p-4">
                  <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
                    Metadata
                  </p>
                  <div className="mt-2">
                    <LedgerRow label="File type" value={doc.fileType || "—"} />
                    <LedgerRow label="Size" value={formatBytes(doc.fileSize)} />
                    <LedgerRow label="Uploaded by" value={doc.uploadedBy} />
                    <LedgerRow
                      label="Created"
                      value={formatDateTimeString(doc.createdAt)}
                      mono
                    />
                    <LedgerRow
                      label="Updated"
                      value={formatDateTimeString(doc.updatedAt)}
                      mono
                    />
                    <LedgerRow
                      label="Checksum"
                      value={doc.checksum}
                      mono
                      title={doc.checksum}
                    />
                    <LedgerRow
                      label="Storage ref"
                      value={doc.storageRef}
                      mono
                      title={doc.storageRef}
                    />
                  </div>
                  {doc.description ? (
                    <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                      {doc.description}
                    </p>
                  ) : null}
                </div>

                {/* Versions */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
                      Versions
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadVersionOpen(true)}
                    >
                      <RiFileAddLine className="mr-1.5 h-3.5 w-3.5" />
                      Upload new version
                    </Button>
                  </div>
                </div>
              </div>

              <DrawerFooter className="border-t border-border">
                <DrawerClose
                  render={<Button variant="outline">Close</Button>}
                />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {pendingTransition && doc ? (
        <TransitionDialog
          documentId={doc.id}
          status={pendingTransition.status}
          title={pendingTransition.title}
          actionLabel={pendingTransition.actionLabel}
          destructive={pendingTransition.destructive}
          onOpenChange={(next) => {
            if (!next) setPendingTransition(null);
          }}
        />
      ) : null}

      {doc ? (
        <UploadVersionDialog
          caseId={caseId}
          documentId={doc.id}
          open={uploadVersionOpen}
          onOpenChange={setUploadVersionOpen}
        />
      ) : null}
    </>
  );
}
