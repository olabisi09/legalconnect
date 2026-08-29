"use client";

import { RiAddLine, RiMapPinLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { eventTypeMeta, toneDot } from "./event-type-badge";
import { formatTimeString } from "@/lib/formatter";
import type { Event } from "@/types/event";

export function DayAgenda({
  dateValue,
  events,
  onSelectEvent,
  onAddEvent,
}: {
  dateValue: string;
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onAddEvent: () => void;
}) {
  const label = new Date(`${dateValue}T00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const sorted = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return (
    <div className="rounded-[3px] border border-border">
      <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
        <div>
          <p className="font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground">
            Docket for
          </p>
          <h3 className="font-newsreader text-base font-medium text-foreground">
            {label}
          </h3>
        </div>
        <Button variant="outline" size="sm" onClick={onAddEvent}>
          <RiAddLine className="mr-1 h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      <div className="max-h-105 divide-y divide-border overflow-y-auto">
        {sorted.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Nothing on the docket for this day.
          </p>
        ) : (
          sorted.map((event) => {
            const meta = eventTypeMeta(event.eventType);
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onSelectEvent(event)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-accent/40"
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[meta.tone]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="mt-0.5 font-plexmono text-[11px] text-muted-foreground">
                    {event.allDay
                      ? "All day"
                      : formatTimeString(event.startTime)}
                    {event.location ? (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <RiMapPinLine className="h-3 w-3" />
                        {event.location}
                      </span>
                    ) : null}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
