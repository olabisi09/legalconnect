"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import { CasePicker } from "./case-picker";
import { useCreateHearing } from "@/hooks/features/use-hearings";
import { HEARING_TYPES } from "@/types/hearing";
import { fromDateTimeLocal } from "@/lib/formatter";
import { capitalize } from "@/lib/utils";

export function HearingFormDialog({
  open,
  onOpenChange,
  defaultCaseId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fills the case picker — e.g. when creating a hearing from a case's own page. */
  defaultCaseId?: string;
}) {
  const [caseId, setCaseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hearingType, setHearingType] = useState(HEARING_TYPES[0]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [location, setLocation] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [hearingNotes, setHearingNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createHearing = useCreateHearing();
  const isSaving = createHearing.isPending;

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaseId(defaultCaseId ?? "");
    setTitle("");
    setDescription("");
    setHearingType(HEARING_TYPES[0]);
    setScheduledDate("");
    setDurationMinutes("60");
    setLocation("");
    setJudgeName("");
    setHearingNotes("");
    setError(null);
  }, [open, defaultCaseId]);

  const handleSubmit = async () => {
    if (!caseId) {
      setError("Select the case this hearing belongs to.");
      return;
    }
    if (!title.trim()) {
      setError("Give the hearing a title.");
      return;
    }
    if (!scheduledDate) {
      setError("Set a scheduled date.");
      return;
    }
    setError(null);

    const payload = {
      caseId,
      title: title.trim(),
      description: description || undefined,
      hearingType,
      scheduledDate: fromDateTimeLocal(scheduledDate),
      durationMinutes: Number(durationMinutes) || undefined,
      location: location || undefined,
      judgeName: judgeName || undefined,
      hearingNotes: hearingNotes || undefined,
    };

    try {
      await createHearing.mutateAsync(payload);
      onOpenChange(false);
    } catch {
      setError("Couldn't save this hearing. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            New hearing
          </DialogTitle>
          <DialogDescription>
            Every hearing is tied to a case — pick one to start.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <Label>Case</Label>
            <CasePicker value={caseId} onChange={setCaseId} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hearing-title">Title</Label>
            <Input
              id="hearing-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Motion to Dismiss — Oral Argument"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Hearing type</Label>
              <Select
                value={hearingType}
                onValueChange={(v) => setHearingType(v as typeof hearingType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEARING_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {capitalize(t.replaceAll("_", " "))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hearing-duration">Duration (minutes)</Label>
              <Input
                id="hearing-duration"
                type="number"
                min={0}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hearing-date">Scheduled date</Label>
            <Input
              id="hearing-date"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="hearing-location">Location</Label>
              <Input
                id="hearing-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Courtroom 4B"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hearing-judge">Judge</Label>
              <Input
                id="hearing-judge"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                placeholder="Hon. J. Alaba"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hearing-description">Description</Label>
            <Textarea
              id="hearing-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hearing-notes">Notes</Label>
            <Textarea
              id="hearing-notes"
              value={hearingNotes}
              onChange={(e) => setHearingNotes(e.target.value)}
              rows={2}
              placeholder="Prep notes, exhibits to bring, anything for the file"
            />
          </div>

          {error ? <p className="text-sm text-lc-stamp">{error}</p> : null}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            loading={isSaving}
            loadingText="Saving..."
            onClick={handleSubmit}
          >
            Create hearing
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
