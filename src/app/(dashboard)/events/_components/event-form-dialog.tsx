"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiDeleteBinLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useCases } from "@/hooks/features/use-cases";
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/features/use-events";
import type { Event } from "@/types/event";
import { EVENT_TYPES } from "@/types/event";
import { REMINDER_OPTIONS, parseReminders } from "./reminders";
import { capitalize } from "@/lib/utils";

function toDateTimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocal(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present = editing this event. Absent = creating a new one. */
  event?: Event | null;
  /** Pre-fills startTime when creating from a clicked calendar day. */
  defaultDate?: string;
}) {
  const isEditing = Boolean(event);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [caseId, setCaseId] = useState<string>("");
  const [reminders, setReminders] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: casesData } = useCases({ page: 0, size: 100 });
  const cases = casesData?.data ?? [];

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const isSaving = createEvent.isPending || updateEvent.isPending;

  // Reset the form whenever a different event opens (or a fresh create opens).
  useEffect(() => {
    if (!open) return;
    if (event) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(event.title);
      setDescription(event.description ?? "");
      setEventType(event.eventType || EVENT_TYPES[0]);
      setStartTime(toDateTimeLocal(event.startTime));
      setEndTime(toDateTimeLocal(event.endTime));
      setAllDay(event.allDay ?? false);
      setLocation(event.location ?? "");
      setCaseId(event.matterId ?? "");
      setReminders(parseReminders(event.reminders));
    } else {
      setTitle("");
      setDescription("");
      setEventType(EVENT_TYPES[0]);
      setStartTime(defaultDate ? `${defaultDate}T09:00` : "");
      setEndTime(defaultDate ? `${defaultDate}T10:00` : "");
      setAllDay(false);
      setLocation("");
      setCaseId("");
      setReminders([0]);
    }
    setError(null);
    setConfirmDelete(false);
  }, [open, event, defaultDate]);

  const toggleReminder = (value: number) => {
    setReminders((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Give the event a title.");
      return;
    }
    if (!startTime) {
      setError("Set a start time.");
      return;
    }
    setError(null);

    const payload = {
      title: title.trim(),
      description: description || undefined,
      eventType,
      startTime: fromDateTimeLocal(startTime),
      endTime: endTime ? fromDateTimeLocal(endTime) : undefined,
      allDay,
      location: location || undefined,
      caseId: caseId || undefined,
      reminders,
    };

    try {
      if (isEditing && event) {
        await updateEvent.mutateAsync({ eventId: event.id, ...payload });
      } else {
        await createEvent.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      setError("Couldn't save this event. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    try {
      await deleteEvent.mutateAsync(event.id);
      setConfirmDelete(false);
      onOpenChange(false);
    } catch {
      setError("Couldn't delete this event. Try again.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-newsreader text-xl font-medium">
              {isEditing ? "Edit event" : "New event"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details on file for this event."
                : "Add a hearing, deadline, or meeting to the docket."}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Motion hearing — Halvorsen v. Reyes"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Event type</Label>
                <Select
                  value={eventType}
                  onValueChange={(value) => setEventType(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {capitalize(t.replaceAll("_", " "))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Case</Label>
                <Select
                  value={caseId || undefined}
                  onValueChange={(v) => setCaseId(v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unlinked" />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((c: { id: string; title: string }) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="all-day"
                checked={allDay}
                onCheckedChange={(v) => setAllDay(Boolean(v))}
              />
              <Label htmlFor="all-day" className="cursor-pointer font-normal">
                All day
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="event-start">Starts</Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-end">Ends</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Courtroom 4B, or a video link"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Reminders</Label>
              <div className="flex flex-wrap gap-1.5">
                {REMINDER_OPTIONS.map((opt) => {
                  const selected = reminders.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleReminder(opt.value)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      {selected ? <RiCheckLine className="h-3 w-3" /> : null}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? <p className="text-sm text-lc-stamp">{error}</p> : null}
          </div>

          <DialogFooter className="items-center pt-2 sm:justify-between">
            {isEditing ? (
              <Button
                type="button"
                variant="ghost"
                className="text-lc-stamp hover:bg-lc-stamp/10 hover:text-lc-stamp"
                onClick={() => setConfirmDelete(true)}
              >
                <RiDeleteBinLine className="mr-1.5 h-4 w-4" />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
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
                {isEditing ? "Save changes" : "Create event"}
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-newsreader text-xl font-medium">
              Delete this event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {event?.title
                ? `"${event.title}" will be removed from the calendar.`
                : "This can't be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEvent.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
              className="bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
            >
              {deleteEvent.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
