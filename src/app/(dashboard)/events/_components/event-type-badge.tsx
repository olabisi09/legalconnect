import {
  RiScales3Line,
  RiFileTextLine,
  RiAlarmLine,
  RiTeamLine,
  RiCalendarEventLine,
} from "@remixicon/react";

export type EventTone = "critical" | "tracked" | "neutral";

const TYPE_META: Record<
  string,
  { label: string; tone: EventTone; icon: typeof RiScales3Line }
> = {
  HEARING: { label: "Hearing", tone: "critical", icon: RiScales3Line },
  DEPOSITION: { label: "Deposition", tone: "critical", icon: RiFileTextLine },
  FILING: { label: "Filing deadline", tone: "critical", icon: RiFileTextLine },
  DEADLINE: { label: "Deadline", tone: "tracked", icon: RiAlarmLine },
  MEETING: { label: "Meeting", tone: "tracked", icon: RiTeamLine },
  REMINDER: { label: "Reminder", tone: "tracked", icon: RiAlarmLine },
  OTHER: { label: "Other", tone: "neutral", icon: RiCalendarEventLine },
};

export const toneStyles: Record<EventTone, string> = {
  critical: "bg-lc-stamp/12 text-lc-stamp",
  tracked: "bg-lc-ledger-pale text-lc-ledger",
  neutral: "bg-secondary text-muted-foreground",
};

export const toneDot: Record<EventTone, string> = {
  critical: "bg-lc-stamp",
  tracked: "bg-lc-ledger",
  neutral: "bg-lc-slate",
};

export function eventTypeMeta(type: string) {
  return (
    TYPE_META[type.toUpperCase()] ?? {
      label: type.replaceAll("_", " "),
      tone: "neutral" as EventTone,
      icon: RiCalendarEventLine,
    }
  );
}

export function EventTypeBadge({ value }: { value: string }) {
  const meta = eventTypeMeta(value);
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plexmono text-[10px] uppercase tracking-wide ${toneStyles[meta.tone]}`}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}
