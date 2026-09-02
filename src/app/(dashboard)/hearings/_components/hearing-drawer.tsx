"use client";

import { useState } from "react";
import {
  RiCalendarEventLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiFilePaperLine,
  RiEditLine,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { HearingStatusBadge, HearingTypeLabel } from "./hearing-badges";
import { CaseCell } from "./case-cell";
import { HearingFormDialog } from "./hearing-form-dialog";
import {
  formatDuration,
  formatDateString,
  formatTimeString,
  toDateTimeLocal,
  fromDateTimeLocal,
} from "@/lib/formatter";
import {
  useHearingDetails,
  useRescheduleHearing,
  useCancelHearing,
  useMarkHearingAsHeld,
  useRecordHearingOutcome,
} from "@/hooks/features/use-hearings";
import { HEARING_OUTCOME_TYPES } from "@/types/hearing";
import { capitalize } from "@/lib/utils";

function LedgerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <span className="font-plexmono text-[10.5px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="max-w-55 text-right text-[13px] font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function RescheduleDialog({
  id,
  currentDate,
  open,
  onOpenChange,
}: {
  id: string;
  currentDate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [date, setDate] = useState(() => toDateTimeLocal(currentDate));
  const [reason, setReason] = useState("");
  const reschedule = useRescheduleHearing();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Reschedule
          </DialogTitle>
          <DialogDescription>
            The previous date is kept on file automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="reschedule-date">New date</Label>
            <Input
              id="reschedule-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reschedule-reason">Reason</Label>
            <Textarea
              id="reschedule-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={reschedule.isPending}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            loading={reschedule.isPending}
            loadingText="Rescheduling..."
            onClick={async () => {
              if (!date || !reason.trim()) return;
              await reschedule.mutateAsync({
                id,
                newDate: fromDateTimeLocal(date),
                reason: reason.trim(),
              });
              onOpenChange(false);
            }}
          >
            Confirm reschedule
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState("");
  const cancelHearing = useCancelHearing();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Cancel hearing
          </DialogTitle>
          <DialogDescription>
            This is final — the hearing won&apos;t be rescheduled automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="cancel-reason">Reason</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cancelHearing.isPending}
          >
            Back
          </Button>
          <AppButton
            type="button"
            className="bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
            loading={cancelHearing.isPending}
            loadingText="Cancelling..."
            onClick={async () => {
              if (!reason.trim()) return;
              await cancelHearing.mutateAsync({
                id: id,
                reason: reason.trim(),
              });
              onOpenChange(false);
            }}
          >
            Cancel hearing
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MarkHeldDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [notes, setNotes] = useState("");
  const markHeld = useMarkHearingAsHeld();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Mark as held
          </DialogTitle>
          <DialogDescription>
            Confirms the hearing took place. Add notes if useful.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="held-notes">Notes (optional)</Label>
          <Textarea
            id="held-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={markHeld.isPending}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            className="bg-lc-ledger text-lc-paper hover:bg-lc-ledger/90"
            loading={markHeld.isPending}
            loadingText="Saving..."
            onClick={async () => {
              await markHeld.mutateAsync(id);
              onOpenChange(false);
            }}
          >
            Mark held
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OutcomeDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [outcomeType, setOutcomeType] = useState(HEARING_OUTCOME_TYPES[0]);
  const [description, setDescription] = useState("");
  const recordOutcome = useRecordHearingOutcome();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Record outcome
          </DialogTitle>
          <DialogDescription>
            This closes the loop on the hearing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Outcome</Label>
            <Select
              value={outcomeType}
              onValueChange={(v) => setOutcomeType(v as typeof outcomeType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEARING_OUTCOME_TYPES.map((o) => (
                  <SelectItem key={o} value={o}>
                    {capitalize(o.replaceAll("_", " "))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="outcome-description">Description</Label>
            <Textarea
              id="outcome-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={recordOutcome.isPending}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            loading={recordOutcome.isPending}
            loadingText="Saving..."
            onClick={async () => {
              await recordOutcome.mutateAsync({
                id,
                outcomeType,
                description: description,
              });
              onOpenChange(false);
            }}
          >
            Record outcome
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HearingDrawer({
  hearingId: id,
  onOpenChange,
}: {
  hearingId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: hearing, isLoading } = useHearingDetails(id ?? "");
  const [action, setAction] = useState<
    "reschedule" | "cancel" | "held" | "outcome" | "edit" | null
  >(null);

  const open = Boolean(id);
  const status = hearing?.status;
  const isUpcoming = status === "SCHEDULED" || status === "RESCHEDULED";

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="ml-auto h-full w-full max-w-lg rounded-none border-l border-border">
          {isLoading || !hearing ? (
            <div className="p-6">
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          ) : (
            <>
              <DrawerHeader className="border-b border-border text-left">
                <p className="font-plexmono text-[10.5px] uppercase tracking-wide text-primary">
                  § Hearing
                </p>
                <DrawerTitle className="font-newsreader text-xl font-medium">
                  {hearing.title}
                </DrawerTitle>
                <DrawerDescription className="flex flex-wrap items-center gap-2 pt-1">
                  <HearingStatusBadge value={hearing.status} />
                  <HearingTypeLabel value={hearing.hearingType} />
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAction("edit")}
                  >
                    <RiEditLine className="mr-1.5 h-4 w-4" />
                    Edit details
                  </Button>
                  {isUpcoming ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAction("reschedule")}
                      >
                        <RiCalendarEventLine className="mr-1.5 h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-lc-ledger/40 text-lc-ledger hover:bg-lc-ledger/10"
                        onClick={() => setAction("held")}
                      >
                        <RiCheckboxCircleLine className="h-4 w-4" />
                        Mark held
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-lc-stamp/40 text-lc-stamp hover:bg-lc-stamp/10"
                        onClick={() => setAction("cancel")}
                      >
                        <RiCloseCircleLine className="mr-1.5 h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : null}
                  {status === "HELD" ? (
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
                      onClick={() => setAction("outcome")}
                    >
                      <RiFilePaperLine className="mr-1.5 h-4 w-4" />
                      Record outcome
                    </Button>
                  ) : null}
                </div>

                <div className="mt-6 rounded-[3px] border border-border p-4">
                  <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
                    Case
                  </p>
                  <div className="mt-2">
                    <CaseCell caseId={hearing.caseId} />
                  </div>
                </div>

                <div className="mt-4 rounded-[3px] border border-border p-4">
                  <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
                    Scheduling
                  </p>
                  <div className="mt-2">
                    <LedgerRow
                      label="Date"
                      value={`${formatDateString(hearing.scheduledDate)} · ${formatTimeString(hearing.scheduledDate)}`}
                    />
                    <LedgerRow
                      label="Duration"
                      value={formatDuration(hearing.durationMinutes)}
                    />
                    <LedgerRow
                      label="Location"
                      value={hearing.location || "—"}
                    />
                    <LedgerRow label="Judge" value={hearing.judgeName || "—"} />
                  </div>
                  {hearing.description ? (
                    <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                      {hearing.description}
                    </p>
                  ) : null}
                </div>

                {hearing.status === "RESCHEDULED" &&
                hearing.previousScheduledDate ? (
                  <div className="mt-4 rounded-[3px] border border-border bg-secondary/40 p-4">
                    <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
                      Rescheduled
                    </p>
                    <div className="mt-2">
                      <LedgerRow
                        label="Previously"
                        value={formatDateString(hearing.previousScheduledDate)}
                      />
                    </div>
                    {hearing.rescheduleReason ? (
                      <p className="mt-2 text-[13px] text-foreground">
                        {hearing.rescheduleReason}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {hearing.status === "CANCELLED" ? (
                  <div className="mt-4 rounded-[3px] border border-lc-stamp/30 bg-lc-stamp/5 p-4">
                    <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-lc-stamp">
                      Cancelled{" "}
                      {hearing.cancelledAt
                        ? formatDateString(hearing.cancelledAt)
                        : ""}
                    </p>
                    {hearing.cancelReason ? (
                      <p className="mt-2 text-[13px] text-foreground">
                        {hearing.cancelReason}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {(hearing.status === "HELD" ||
                  hearing.status === "OUTCOME_RECORDED") &&
                hearing.hearingNotes ? (
                  <div className="mt-4 rounded-[3px] border border-border p-4">
                    <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
                      Notes
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground">
                      {hearing.hearingNotes}
                    </p>
                  </div>
                ) : null}

                {hearing.status === "OUTCOME_RECORDED" ? (
                  <div className="mt-4 rounded-[3px] border border-lc-ledger bg-lc-ledger-pale/40 p-4">
                    <p className="mb-1 font-plexmono text-[10px] uppercase tracking-wide text-lc-ledger">
                      Outcome — {hearing.outcomeType?.replaceAll("_", " ")}
                    </p>
                    {hearing.outcomeDescription ? (
                      <p className="mt-2 text-[13px] text-foreground">
                        {hearing.outcomeDescription}
                      </p>
                    ) : null}
                    {hearing.outcomeRecordedAt ? (
                      <p className="mt-2 font-plexmono text-[10.5px] text-muted-foreground">
                        Recorded {formatDateString(hearing.outcomeRecordedAt)}
                      </p>
                    ) : null}
                  </div>
                ) : null}
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

      {hearing ? (
        <>
          <RescheduleDialog
            id={hearing.id}
            currentDate={hearing.scheduledDate}
            open={action === "reschedule"}
            onOpenChange={(o) => setAction(o ? "reschedule" : null)}
          />
          <CancelDialog
            id={hearing.id}
            open={action === "cancel"}
            onOpenChange={(o) => setAction(o ? "cancel" : null)}
          />
          <MarkHeldDialog
            id={hearing.id}
            open={action === "held"}
            onOpenChange={(o) => setAction(o ? "held" : null)}
          />
          <OutcomeDialog
            id={hearing.id}
            open={action === "outcome"}
            onOpenChange={(o) => setAction(o ? "outcome" : null)}
          />
          <HearingFormDialog
            open={action === "edit"}
            onOpenChange={(o) => setAction(o ? "edit" : null)}
          />
        </>
      ) : null}
    </>
  );
}
