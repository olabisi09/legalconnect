"use client";

import { useMemo, useState } from "react";
import { AppButton } from "@/components/app-button";
import { Input } from "@/components/ui/input";
import { RiAddLine } from "@remixicon/react";
import { useEvents } from "@/hooks/features/use-events";
import { useDebounce } from "@/hooks/use-debounce";
import { EVENT_TYPES } from "@/types/event";
import type { Event } from "@/types/event";
import { capitalize } from "@/lib/utils";
import { Filters, type FilterField } from "@/components/filters";
import { MonthCalendar } from "./_components/month-calendar";
import { DayAgenda } from "./_components/day-agenda";
import { EventFormDialog } from "./_components/event-form-dialog";
import { toDateInputValue } from "./_components/date-grid";

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() =>
    toDateInputValue(new Date()),
  );

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [allDay, setAllDay] = useState<boolean | undefined>(undefined);

  const debouncedSearch = useDebounce(search);

  // Scoped to the visible month grid (including the leading/trailing days shown),
  // assuming the backend honors from/to — see the note on EventParams if it doesn't.
  const { from, to } = useMemo(() => {
    const gridStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1 - 7);
    const gridEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 7);
    return { from: gridStart.toISOString(), to: gridEnd.toISOString() };
  }, [cursor]);

  const { data, isLoading } = useEvents({
    // search: debouncedSearch,
    // eventType: eventType || undefined,
    // allDay,
    from,
    to,
  });

  // Assumes a flat array response — see the note in use-events.ts if yours is wrapped.
  const events: Event[] = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const event of events) {
      const start = new Date(event.startTime);
      if (Number.isNaN(start.getTime())) continue;
      const key = toDateInputValue(start);
      map.set(key, [...(map.get(key) ?? []), event]);
    }
    return map;
  }, [events]);

  const filterFields: FilterField[] = [
    {
      key: "eventType",
      label: "Event type",
      type: "select",
      value: eventType,
      onChange: setEventType,
      options: EVENT_TYPES.map((t) => ({
        value: t,
        label: capitalize(t.replaceAll("_", " ")),
      })),
    },
    {
      key: "allDay",
      label: "All day",
      type: "boolean",
      value: allDay,
      onChange: setAllDay,
    },
  ];

  const openCreate = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  return (
    <div>
      <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        Calendar &amp; Deadlines
      </p>
      <h1 className="mt-2 font-newsreader text-[28px] font-medium text-foreground">
        Calendar
      </h1>
      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
        Hearings, filings, and meetings across the firm — linked back to their
        case where one applies.
      </p>

      <div className="mt-8 grid gap-4">
        <section className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search events"
            className="w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Filters fields={filterFields} />
          <div className="ml-auto flex gap-2">
            <AppButton onClick={openCreate}>
              <RiAddLine />
              New event
            </AppButton>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[3px] border border-border p-10 text-center text-sm text-muted-foreground">
            Loading the calendar…
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <MonthCalendar
              cursor={cursor}
              onCursorChange={setCursor}
              selectedDay={selectedDay}
              events={events}
              onSelectDay={setSelectedDay}
              onSelectEvent={openEdit}
            />
            <DayAgenda
              dateValue={selectedDay}
              events={eventsByDay.get(selectedDay) ?? []}
              onSelectEvent={openEdit}
              onAddEvent={openCreate}
            />
          </div>
        )}

        <EventFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          event={editingEvent}
          defaultDate={selectedDay}
        />
      </div>
    </div>
  );
}
