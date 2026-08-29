"use client";

import { useMemo } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { buildMonthGrid, isSameDay, toDateInputValue } from "./date-grid";
import { eventTypeMeta, toneDot } from "./event-type-badge";
import type { Event } from "@/types/event";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_PER_DAY = 3;

export function MonthCalendar({
  cursor,
  onCursorChange,
  selectedDay,
  events,
  onSelectEvent,
  onSelectDay,
}: {
  cursor: Date;
  onCursorChange: (date: Date) => void;
  selectedDay?: string;
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onSelectDay: (dateValue: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const event of events) {
      const start = new Date(event.startTime);
      if (Number.isNaN(start.getTime())) continue;
      const key = toDateInputValue(start);
      const existing = map.get(key) ?? [];
      existing.push(event);
      map.set(key, existing);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
    }
    return map;
  }, [events]);

  return (
    <div className="overflow-hidden rounded-[3px] border border-border">
      <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
        <h3 className="font-newsreader text-lg font-medium text-foreground">
          {cursor.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCursorChange(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onCursorChange(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
              )
            }
          >
            <RiArrowLeftSLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onCursorChange(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
              )
            }
          >
            <RiArrowRightSLine className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-secondary/50">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-1.5 text-center font-plexmono text-[10px] uppercase tracking-wide text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((day, i) => {
          const inCurrentMonth = day.getMonth() === cursor.getMonth();
          const isToday = isSameDay(day, today);
          const dayValue = toDateInputValue(day);
          const isSelected = selectedDay === dayValue;
          const dayEvents = eventsByDay.get(dayValue) ?? [];
          const overflow = dayEvents.length - MAX_VISIBLE_PER_DAY;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(dayValue)}
              className={`flex min-h-23 flex-col items-stretch gap-1 border-b border-r border-border p-1.5 text-left last:border-r-0 hover:bg-accent/30 ${
                isSelected
                  ? "bg-primary/5 ring-1 ring-inset ring-primary/40"
                  : inCurrentMonth
                    ? "bg-background"
                    : "bg-secondary/30"
              }`}
            >
              <span
                className={`self-start font-plexmono text-[11px] ${
                  isToday
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : inCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {day.getDate()}
              </span>

              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, MAX_VISIBLE_PER_DAY).map((event) => {
                  const meta = eventTypeMeta(event.eventType);
                  return (
                    <span
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      className="flex items-center gap-1 truncate rounded-sm px-1 py-0.5 text-[10.5px] text-foreground hover:bg-accent"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[meta.tone]}`}
                      />
                      <span className="truncate">{event.title}</span>
                    </span>
                  );
                })}
                {overflow > 0 ? (
                  <span className="px-1 font-plexmono text-[10px] text-muted-foreground">
                    +{overflow} more
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
